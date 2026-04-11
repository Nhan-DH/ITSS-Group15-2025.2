package feedback_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListFeedbacksUseCase interface {
	Execute(ctx context.Context) ([]*entity.Feedback, error)
}

type ListFeedbacksUseCase struct {
	repo adapter.FeedbackRepository
}

func NewListFeedbacksUseCase(repo adapter.FeedbackRepository) IListFeedbacksUseCase {
	return &ListFeedbacksUseCase{repo: repo}
}

func (u *ListFeedbacksUseCase) Execute(ctx context.Context) ([]*entity.Feedback, error) {
	return u.repo.GetAll()
}
