package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/mocks"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/school"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

type SchoolTestSuite struct {
	testutils.BaseTestSuite

	StudentImageStorage mocks.StudentImageStorage
	store               postgres.SchoolStore
}

func (s *SchoolTestSuite) SetupTest() {
	s.store = postgres.SchoolStore{s.DB, minio.NewFileStorage(s.MinioClient)}
	s.StudentImageStorage = mocks.StudentImageStorage{}
	s.Handler = school.NewRouter(s.Server, s.store, &s.StudentImageStorage, nil).ServeHTTP
}

func TestSchool(t *testing.T) {
	suite.Run(t, new(SchoolTestSuite))
}

func (s *SchoolTestSuite) SaveNewClass(school postgres.School) *postgres.Class {
	t := s.T()
	newClass := postgres.Class{
		Id:        uuid.New().String(),
		SchoolId:  school.Id,
		School:    school,
		Name:      gofakeit.Name(),
		StartTime: time.Now(),
		EndTime:   time.Now(),
	}
	newClass.Weekdays = []postgres.Weekday{
		{newClass.Id, time.Sunday, newClass},
		{newClass.Id, time.Thursday, newClass},
		{newClass.Id, time.Friday, newClass},
	}
	err := s.DB.Insert(&newClass)
	assert.NoError(t, err)
	err = s.DB.Insert(&newClass.Weekdays)
	assert.NoError(t, err)
	return &newClass
}

func (s *SchoolTestSuite) SaveNewGuardian() (*postgres.Guardian, string) {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.SaveNewSchool()
	newGuardian := postgres.Guardian{
		Id:       uuid.New().String(),
		Name:     gofakeit.Name(),
		Email:    gofakeit.Email(),
		Phone:    gofakeit.Phone(),
		Note:     gofakeit.Paragraph(1, 3, 20, " "),
		SchoolId: newSchool.Id,
		School:   *newSchool,
	}
	err := s.DB.Insert(&newGuardian)
	assert.NoError(t, err)
	return &newGuardian, newSchool.Users[0].Id
}

func (s *SchoolTestSuite) SaveNewLessonPlan() (*postgres.LessonPlan, string) {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.SaveNewSchool()
	newClass := s.SaveNewClass(*newSchool)

	title := gofakeit.Name()
	description := gofakeit.Name()
	details := postgres.LessonPlanDetails{
		Id:             uuid.New().String(),
		Title:          title,
		Description:    &description,
		ClassId:        newClass.Id,
		Class:          *newClass,
		Files:          nil,
		RepetitionType: 0,
	}
	date := gofakeit.Date()
	newLessonPlan := postgres.LessonPlan{
		Id:                  uuid.New().String(),
		Date:                &date,
		LessonPlanDetailsId: details.Id,
		LessonPlanDetails:   details,
	}
	err := s.DB.Insert(&details)
	assert.NoError(t, err)
	err = s.DB.Insert(&newLessonPlan)
	assert.NoError(t, err)
	return &newLessonPlan, newSchool.Users[0].Id
}
