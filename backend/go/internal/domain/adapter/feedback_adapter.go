package adapter

import "gym-management/internal/domain/entity"

type FeedbackRepository interface {
	Create(feedback *entity.Feedback) error
	GetByID(id int) (*entity.Feedback, error)
	GetAll() ([]*entity.Feedback, error)
	GetAllPaginated(page, limit int, status string) ([]*entity.Feedback, int, error)
	Update(feedback *entity.Feedback) error
	Delete(id int) error
	GetByMemberID(memberID int) ([]*entity.Feedback, error)
	UpdateStatus(id int, status, resolutionNote string) error
}
