package usecase

import "gym-management/internal/domain/entity"

type TrainingSessionUsecase interface {
	CreateTrainingSession(ts *entity.TrainingSession) error
	GetTrainingSessionByID(id int) (*entity.TrainingSession, error)
	GetAllTrainingSessions() ([]*entity.TrainingSession, error)
	UpdateTrainingSession(ts *entity.TrainingSession) error
	DeleteTrainingSession(id int) error
}
