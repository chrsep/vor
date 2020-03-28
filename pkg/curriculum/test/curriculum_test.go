package curriculum_test

import (
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// Test suite
type baseCurriculumTestSuite struct {
	testutils.BaseTestSuite
	store curriculum.Store
}

func (s *baseCurriculumTestSuite) SetupTest() {
	s.store = postgres.CurriculumStore{s.DB}
	s.Handler = curriculum.NewRouter(s.Server, s.store).ServeHTTP
}

/////////////////////////////////
// Helper functions
/////////////////////////////////
func (s *baseCurriculumTestSuite) saveNewMaterial() (postgres.Material, string) {
	subject, userId := s.saveNewSubject()

	// save subject
	material := postgres.Material{
		Id:        uuid.New().String(),
		Name:      uuid.New().String(),
		SubjectId: subject.Id,
		Subject:   subject,
	}
	err := s.DB.Insert(&material)
	assert.NoError(s.T(), err)
	return material, userId
}

func (s *baseCurriculumTestSuite) saveNewSubject() (postgres.Subject, string) {
	// Save area
	area, userId := s.saveNewArea()

	// save subject
	originalSubject := postgres.Subject{
		Id:     uuid.New().String(),
		Name:   uuid.New().String(),
		AreaId: area.Id,
		Area:   area,
	}
	err := s.DB.Insert(&originalSubject)
	assert.NoError(s.T(), err)
	return originalSubject, userId
}

func (s *baseCurriculumTestSuite) saveNewArea() (postgres.Area, string) {
	school := s.SaveNewSchool()
	area := postgres.Area{
		Id:           uuid.New().String(),
		CurriculumId: school.CurriculumId,
		Curriculum:   school.Curriculum,
		Name:         "",
		Subjects:     nil,
	}
	err := s.DB.Insert(&area)
	assert.NoError(s.T(), err)
	return area, school.Users[0].Id
}
