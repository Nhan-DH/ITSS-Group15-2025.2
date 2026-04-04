package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"
)

type feedbackUsecase struct {
	repo adapter.FeedbackRepository
}

func NewFeedbackUsecase(repo adapter.FeedbackRepository) usecase.FeedbackUsecase {
	return &feedbackUsecase{repo: repo}
}

func (u *feedbackUsecase) CreateFeedback(feedback *entity.Feedback) error {
	return u.repo.Create(feedback)
}

func (u *feedbackUsecase) GetFeedbackByID(id int) (*entity.Feedback, error) {
	return u.repo.GetByID(id)
}

func (u *feedbackUsecase) GetAllFeedbacks() ([]*entity.Feedback, error) {
	return u.repo.GetAll()
}

func (u *feedbackUsecase) UpdateFeedback(feedback *entity.Feedback) error {
	return u.repo.Update(feedback)
}

func (u *feedbackUsecase) DeleteFeedback(id int) error {
	return u.repo.Delete(id)
}
