package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type TrainingSessionUsecase interface {
	CreateTrainingSession(trainingSession *entity.TrainingSession) error
	GetTrainingSessionByID(id int) (*entity.TrainingSession, error)
	GetAllTrainingSessions() ([]*entity.TrainingSession, error)
	UpdateTrainingSession(trainingSession *entity.TrainingSession) error
	DeleteTrainingSession(id int) error
}

type trainingSessionUsecase struct {
	repo adapter.TrainingSessionRepository
}

func NewTrainingSessionUsecase(repo adapter.TrainingSessionRepository) TrainingSessionUsecase {
	return &trainingSessionUsecase{repo: repo}
}

func (u *trainingSessionUsecase) CreateTrainingSession(trainingSession *entity.TrainingSession) error {
	return u.repo.Create(trainingSession)
}

func (u *trainingSessionUsecase) GetTrainingSessionByID(id int) (*entity.TrainingSession, error) {
	return u.repo.GetByID(id)
}

func (u *trainingSessionUsecase) GetAllTrainingSessions() ([]*entity.TrainingSession, error) {
	return u.repo.GetAll()
}

func (u *trainingSessionUsecase) UpdateTrainingSession(trainingSession *entity.TrainingSession) error {
	return u.repo.Update(trainingSession)
}

func (u *trainingSessionUsecase) DeleteTrainingSession(id int) error {
	return u.repo.Delete(id)
}
