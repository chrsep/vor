package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
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

	store postgres.SchoolStore
}

func (s *SchoolTestSuite) SetupTest() {
	s.store = postgres.SchoolStore{s.DB}
	s.Handler = school.NewRouter(s.Server, s.store).ServeHTTP
}

func TestObservation(t *testing.T) {
	suite.Run(t, new(SchoolTestSuite))
}

func (s *SchoolTestSuite) SaveNewSchool() *postgres.School {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newUser := postgres.User{Id: uuid.New().String()}
	newSchool := postgres.School{
		Id:           uuid.New().String(),
		Name:         gofakeit.Name(),
		InviteCode:   uuid.New().String(),
		Users:        []postgres.User{},
		CurriculumId: "",
		Curriculum:   postgres.Curriculum{},
	}
	newSchool.Users = []postgres.User{newUser}
	schoolUserRelation := postgres.UserToSchool{
		SchoolId: newSchool.Id,
		UserId:   newUser.Id,
	}
	if err := s.DB.Insert(&newUser); err != nil {
		assert.NoError(t, err)
		return nil
	}
	if err := s.DB.Insert(&newSchool); err != nil {
		assert.NoError(t, err)
		return nil
	}
	if err := s.DB.Insert(&schoolUserRelation); err != nil {
		assert.NoError(t, err)
		return nil
	}
	return &newSchool
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
