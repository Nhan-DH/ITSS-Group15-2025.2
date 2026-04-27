package training_session_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type TrainingSessionUsecase interface {
	CreateTrainingSession(trainingSession *entity.TrainingSession) error
	GetTrainingSessionByID(id int) (*entity.TrainingSession, error)
	GetAllTrainingSessions() ([]*entity.TrainingSession, error)
	UpdateTrainingSession(trainingSession *entity.TrainingSession) error
	DeleteTrainingSession(id int) error
	GetTrainingHistoryByMemberID(memberID int) ([]*entity.TrainingSession, error)
	GetUpcomingTrainingSessionsByMemberID(memberID int) ([]*entity.TrainingSession, error)
}

type trainingSessionUsecase struct {
	create          ICreateTrainingSessionUseCase
	get             IGetTrainingSessionUseCase
	list            IListTrainingSessionsUseCase
	update          IUpdateTrainingSessionUseCase
	delete          IDeleteTrainingSessionUseCase
	getPastByMember     IGetPastTrainingSessionsByMemberUseCase
	getUpcomingByMember IGetUpcomingTrainingSessionsByMemberUseCase
}

func NewTrainingSessionUsecase(repo adapter.TrainingSessionRepository) TrainingSessionUsecase {
	return &trainingSessionUsecase{
		create:              NewCreateTrainingSessionUseCase(repo),
		get:                 NewGetTrainingSessionUseCase(repo),
		list:                NewListTrainingSessionsUseCase(repo),
		update:              NewUpdateTrainingSessionUseCase(repo),
		delete:              NewDeleteTrainingSessionUseCase(repo),
		getPastByMember:     NewGetPastTrainingSessionsByMemberUseCase(repo),
		getUpcomingByMember: NewGetUpcomingTrainingSessionsByMemberUseCase(repo),
	}
}

func (u *trainingSessionUsecase) CreateTrainingSession(trainingSession *entity.TrainingSession) error {
	created, err := u.create.Execute(context.Background(), trainingSession)
	if err != nil {
		return err
	}
	*trainingSession = *created
	return nil
}

func (u *trainingSessionUsecase) GetTrainingSessionByID(id int) (*entity.TrainingSession, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *trainingSessionUsecase) GetAllTrainingSessions() ([]*entity.TrainingSession, error) {
	return u.list.Execute(context.Background())
}

func (u *trainingSessionUsecase) UpdateTrainingSession(trainingSession *entity.TrainingSession) error {
	updated, err := u.update.Execute(context.Background(), trainingSession)
	if err != nil {
		return err
	}
	*trainingSession = *updated
	return nil
}

func (u *trainingSessionUsecase) DeleteTrainingSession(id int) error {
	return u.delete.Execute(context.Background(), id)
}

func (u *trainingSessionUsecase) GetTrainingHistoryByMemberID(memberID int) ([]*entity.TrainingSession, error) {
	return u.getPastByMember.Execute(context.Background(), memberID)
}

func (u *trainingSessionUsecase) GetUpcomingTrainingSessionsByMemberID(memberID int) ([]*entity.TrainingSession, error) {
	return u.getUpcomingByMember.Execute(context.Background(), memberID)
}
