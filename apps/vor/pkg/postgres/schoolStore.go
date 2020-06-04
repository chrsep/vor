package postgres

import (
	"github.com/go-pg/pg/v9/orm"
	"time"

	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"

	cSchool "github.com/chrsep/vor/pkg/school"
)

type (
	SchoolStore struct {
		*pg.DB
	}
)

func (s SchoolStore) NewSchool(schoolName, userId string) (*cSchool.School, error) {
	id := uuid.New()
	inviteCode := uuid.New()
	school := School{
		Id:         id.String(),
		Name:       schoolName,
		InviteCode: inviteCode.String(),
	}
	userToSchoolRelation := UserToSchool{
		SchoolId: id.String(),
		UserId:   userId,
	}
	err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := s.Insert(&school); err != nil {
			return err
		}
		if err := s.Insert(&userToSchoolRelation); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return &cSchool.School{
		Id:         school.Id,
		Name:       school.Name,
		InviteCode: school.InviteCode,
	}, nil
}

func (s SchoolStore) GetSchool(schoolId string) (*cSchool.School, error) {
	var school School
	if err := s.Model(&school).
		Relation("Users").
		Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}

	userData := make([]*cSchool.User, 0)
	for _, user := range school.Users {
		userData = append(userData, &cSchool.User{
			Id:    user.Id,
			Email: user.Email,
			Name:  user.Name,
		})
	}

	return &cSchool.School{
		Id:         school.Id,
		Name:       school.Name,
		InviteCode: school.InviteCode,
		Users:      userData,
	}, nil
}

func (s SchoolStore) GetStudents(schoolId string) ([]cSchool.Student, error) {
	var students []Student
	res := make([]cSchool.Student, 0)

	if err := s.Model(&students).
		Where("school_id=?", schoolId).
		Order("name").
		Select(); err == pg.ErrNoRows {
		return res, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "Failed querying student")
	}

	for _, s := range students {
		res = append(res, cSchool.Student{
			Id:          s.Id,
			Name:        s.Name,
			SchoolId:    s.SchoolId,
			ProfilePic:  s.ProfilePic,
			DateOfBirth: s.DateOfBirth,
		})
	}

	return res, nil
}

func (s SchoolStore) GetClassAttendance(classId, session string) ([]cSchool.Attendance, error) {
	var attendance []Attendance
	res := make([]cSchool.Attendance, 0)

	if session == "" {
		session = "1970-01-01"
	}
	if err := s.Model(&attendance).
		Where("class_id=?", classId).
		Where("date::date=?", session).
		Relation("Student").
		Relation("Class.Students").
		Select(); err != nil {
		return res, err
	}

	for _, v := range attendance {
		students := make([]cSchool.Student, 0)
		for _, student := range v.Class.Students {
			students = append(students, cSchool.Student{
				Id:   student.Id,
				Name: student.Name,
			})
		}

		res = append(res, cSchool.Attendance{
			Id:        v.Id,
			StudentId: v.StudentId,
			Class: cSchool.Class{
				Students: students,
			},
		})
	}

	return res, nil
}

func (s SchoolStore) NewStudent(student cSchool.Student, classes []string, guardians map[string]int) error {
	if student.Id == "" {
		student.Id = uuid.New().String()
	}
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		classRelations := make([]StudentToClass, len(classes))
		for i, class := range classes {
			classRelations[i] = StudentToClass{
				StudentId: student.Id,
				ClassId:   class,
			}
		}

		guardianRelations := make([]GuardianToStudent, 0)
		for id, guardian := range guardians {
			guardianRelations = append(guardianRelations, GuardianToStudent{
				StudentId:    student.Id,
				GuardianId:   id,
				Relationship: GuardianRelationship(guardian),
			})
		}

		if err := tx.Insert(&student); err != nil {
			return richErrors.Wrap(err, "failed to save new student")
		}
		if len(classRelations) > 0 {
			if err := tx.Insert(&classRelations); err != nil {
				return richErrors.Wrap(err, "failed to save student to class relation")
			}
		}
		if len(guardianRelations) > 0 {
			if err := tx.Insert(&guardianRelations); err != nil {
				return richErrors.Wrap(err, "failed to save guardian to student relation")
			}
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) RefreshInviteCode(schoolId string) (*cSchool.School, error) {
	// TODO: This should be done in a single query
	var school School
	if err := s.Model(&school).
		Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}

	// Update invite code
	school.InviteCode = uuid.New().String()
	if err := s.Update(&school); err != nil {
		return nil, err
	}
	return &cSchool.School{
		Id:         school.Id,
		Name:       school.Name,
		InviteCode: school.InviteCode,
	}, nil
}

func (s SchoolStore) NewDefaultCurriculum(schoolId string) error {
	c := createDefault()
	err := s.RunInTransaction(
		func(tx *pg.Tx) error {
			// Save the curriculum tree.
			if err := tx.Insert(&c); err != nil {
				return err
			}
			for _, area := range c.Areas {
				if err := tx.Insert(&area); err != nil {
					return err
				}
				for _, subject := range area.Subjects {
					if err := tx.Insert(&subject); err != nil {
						return err
					}
					for _, material := range subject.Materials {
						if err := tx.Insert(&material); err != nil {
							return err
						}
					}
				}
			}

			// Update the school with the new curriculum id
			if _, err := tx.Model(&School{Id: schoolId, CurriculumId: c.Id}).
				WherePK().
				UpdateNotZero(); err != nil {
				return richErrors.Wrap(err, "Failed saving curriculum")
			}
			return nil
		})
	if err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) DeleteCurriculum(schoolId string) error {
	school, err := s.GetSchool(schoolId)
	if err != nil {
		return err
	}
	if school.CurriculumId == "" {
		return cSchool.EmptyCurriculumError
	}
	c := Curriculum{Id: school.CurriculumId}
	return s.Delete(&c)
}

func (s SchoolStore) GetCurriculum(schoolId string) (*cSchool.Curriculum, error) {
	var school School
	err := s.Model(&school).
		Relation("Curriculum").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, cSchool.EmptyCurriculumError
	}

	return &cSchool.Curriculum{
		Id:   school.Curriculum.Id,
		Name: school.Curriculum.Name,
	}, nil
}

func (s SchoolStore) GetCurriculumAreas(schoolId string) ([]cSchool.Area, error) {
	var school School
	res := make([]cSchool.Area, 0)
	err := s.Model(&school).
		Relation("Curriculum").
		Relation("Curriculum.Areas").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, cSchool.EmptyCurriculumError
	}

	for _, v := range school.Curriculum.Areas {
		res = append(res, cSchool.Area{
			Id:   v.Id,
			Name: v.Name,
		})
	}
	return res, nil
}

func (s SchoolStore) NewClass(id string, name string, weekdays []time.Weekday, startTime, endTime time.Time) error {
	newClass := Class{
		Id:        uuid.New().String(),
		SchoolId:  id,
		Name:      name,
		StartTime: startTime,
		EndTime:   endTime,
	}
	var dbWeekdays []Weekday
	for _, weekday := range weekdays {
		dbWeekdays = append(dbWeekdays, Weekday{
			ClassId: newClass.Id,
			Day:     weekday,
		})
	}
	if err := s.DB.RunInTransaction(func(tx *pg.Tx) error {
		if err := tx.Insert(&newClass); err != nil {
			return richErrors.Wrap(err, "Failed saving new class")
		}
		if len(dbWeekdays) > 0 {
			if err := tx.Insert(&dbWeekdays); err != nil {
				return richErrors.Wrap(err, "Failed saving weekdays")
			}
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) GetSchoolClasses(schoolId string) ([]cSchool.Class, error) {
	var classes []Class
	res := make([]cSchool.Class, 0)

	if err := s.DB.Model(&classes).
		Where("school_id=?", schoolId).
		Relation("Weekdays").
		Select(); err != nil {
		return nil, err
	}

	for _, v := range classes {
		weekdays := make([]cSchool.Weekday, 0)
		for _, day := range v.Weekdays {
			weekdays = append(weekdays, cSchool.Weekday{
				Day: day.Day,
			})
		}
		res = append(res, cSchool.Class{
			Id:        v.Id,
			Name:      v.Name,
			StartTime: v.StartTime,
			EndTime:   v.EndTime,
			Weekdays:  weekdays,
		})
	}

	return res, nil
}

func (s SchoolStore) InsertGuardianWithRelation(input cSchool.GuardianWithRelation) (*cSchool.Guardian, error) {
	guardian := Guardian{
		Id:       uuid.New().String(),
		Name:     input.Name,
		Email:    input.Email,
		Phone:    input.Phone,
		Note:     input.Note,
		SchoolId: input.SchoolId,
	}
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		if _, err := s.Model(&guardian).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to insert new guardian")
		}

		// Creating relation is optional
		if input.StudentId != nil && input.Relationship != nil {
			relation := GuardianToStudent{
				StudentId:    *input.StudentId,
				GuardianId:   guardian.Id,
				Relationship: GuardianRelationship(*input.Relationship),
			}
			if _, err := s.Model(&relation).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to insert guardian to student relation")
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return &cSchool.Guardian{
		Id:       guardian.Id,
		Name:     guardian.Name,
		Email:    guardian.Email,
		Phone:    guardian.Phone,
		Note:     guardian.Note,
		SchoolId: guardian.SchoolId,
	}, nil
}

func (s SchoolStore) GetGuardians(schoolId string) ([]cSchool.Guardian, error) {
	var guardian []Guardian
	res := make([]cSchool.Guardian, 0)

	if err := s.DB.Model(&guardian).
		Where("school_id=?", schoolId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to query school's guardians")
	}

	for _, v := range guardian {
		res = append(res, cSchool.Guardian{
			Id:    v.Id,
			Name:  v.Name,
			Email: v.Email,
			Phone: v.Phone,
			Note:  v.Note,
		})
	}

	return res, nil
}
func (s SchoolStore) GetLessonPlans(schoolId string, date string) ([]cSchool.LessonPlan, error) {
	var lessonPlan []LessonPlan
	res := make([]cSchool.LessonPlan, 0)
	if date == "" {
		date = "1970-01-01"
	}
	if err := s.DB.Model(&lessonPlan).
		Where("lesson_plan.start_time::date=?", date).
		Relation("Class", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("school_id = ?", schoolId), nil
		}).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed to query school's lesson plan")
	}
	for _, v := range lessonPlan {
		res = append(res, cSchool.LessonPlan{
			Id:          v.Id,
			Title:       v.Title,
			Description: v.Description,
			ClassId:     v.ClassId,
			ClassName:   v.Class.Name,
			StartTime:   v.StartTime,
		})
	}
	return res, nil
}
func (s SchoolStore) GetLessonFiles(schoolId string) ([]cSchool.File, error) {
	var lessonPlan []LessonPlan
	files := make([]cSchool.File, 0)
	if err := s.DB.Model(&lessonPlan).
		Relation("Files").
		Relation("Class", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("school_id = ?", schoolId), nil
		}).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed to query school's files")
	}
	for _, v := range lessonPlan {
		println("len", len(v.Files))
		for _, f := range v.Files {
			files = append(files, cSchool.File{
				Id:   f.Id,
				Name: f.Name,
			})
		}
	}
	return files, nil
}

func (s SchoolStore) CreateFile(schoolId, file string) (*cSchool.FileData, error) {
	obj := File{
		Id:       uuid.New().String(),
		SchoolId: schoolId,
		FileName: file,
	}
	if err := s.Insert(&obj); err != nil {
		return nil, richErrors.Wrap(err, "failed to create file:")
	}
	return &cSchool.FileData{
		FileId:   obj.Id,
		SchoolId: obj.SchoolId,
		FileName: obj.FileName,
	}, nil
}

func (s SchoolStore) DeleteFile(fileId string) error {
	return s.Delete(&File{Id: fileId})
}

func (s SchoolStore) UpdateFile(fileId, fileName string) (*cSchool.FileData, error) {
	obj := File{
		Id:       fileId,
		FileName: fileName,
	}
	res, err := s.Model(&obj).Column("file_name").
		Returning("*").WherePK().Update()
	if err != nil {
		return nil, richErrors.Wrap(err, "failed update file:")
	}

	if res.RowsAffected() == 0 {
		return nil, pg.ErrNoRows
	}

	return &cSchool.FileData{
		FileId:   obj.Id,
		SchoolId: obj.SchoolId,
		FileName: obj.FileName,
	}, nil
}