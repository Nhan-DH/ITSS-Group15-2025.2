package usecase

import "gym-management/internal/domain/entity"

type FeedbackUsecase interface {
	CreateFeedback(feedback *entity.Feedback) error
	GetFeedbackByID(id int) (*entity.Feedback, error)
	GetAllFeedbacks() ([]*entity.Feedback, error)
	UpdateFeedback(feedback *entity.Feedback) error
	DeleteFeedback(id int) error
}
