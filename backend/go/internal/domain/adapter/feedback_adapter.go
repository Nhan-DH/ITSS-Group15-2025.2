package adapter

import "gym-management/internal/domain/entity"

type FeedbackRepository interface {
	Create(feedback *entity.Feedback) error
	GetByID(id int) (*entity.Feedback, error)
	GetAll() ([]*entity.Feedback, error)
	Update(feedback *entity.Feedback) error
	Delete(id int) error
}
