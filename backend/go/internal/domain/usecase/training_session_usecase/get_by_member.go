package training_session_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

// IGetPastTrainingSessionsByMemberUseCase lấy lịch sử session đã qua theo member.
type IGetPastTrainingSessionsByMemberUseCase interface {
	Execute(ctx context.Context, memberID int) ([]*entity.TrainingSession, error)
}

type getPastTrainingSessionsByMemberUseCase struct {
	repo adapter.TrainingSessionRepository
}

func NewGetPastTrainingSessionsByMemberUseCase(repo adapter.TrainingSessionRepository) IGetPastTrainingSessionsByMemberUseCase {
	return &getPastTrainingSessionsByMemberUseCase{repo: repo}
}

func (uc *getPastTrainingSessionsByMemberUseCase) Execute(ctx context.Context, memberID int) ([]*entity.TrainingSession, error) {
	return uc.repo.GetPastByMemberID(memberID)
}

// IGetUpcomingTrainingSessionsByMemberUseCase lấy session sắp tới theo member.
type IGetUpcomingTrainingSessionsByMemberUseCase interface {
	Execute(ctx context.Context, memberID int) ([]*entity.TrainingSession, error)
}

type getUpcomingTrainingSessionsByMemberUseCase struct {
	repo adapter.TrainingSessionRepository
}

func NewGetUpcomingTrainingSessionsByMemberUseCase(repo adapter.TrainingSessionRepository) IGetUpcomingTrainingSessionsByMemberUseCase {
	return &getUpcomingTrainingSessionsByMemberUseCase{repo: repo}
}

func (uc *getUpcomingTrainingSessionsByMemberUseCase) Execute(ctx context.Context, memberID int) ([]*entity.TrainingSession, error) {
	return uc.repo.GetUpcomingByMemberID(memberID)
}
