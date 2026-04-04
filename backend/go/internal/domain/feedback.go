package domain

import "time"

type Feedback struct {
	ID             int       `json:"id"`
	MemberID       int       `json:"member_id"`
	ProcessorID    int       `json:"processor_id"`
	EquipmentID    int       `json:"equipment_id"`
	Content        string    `json:"content"`
	SentAt         time.Time `json:"sent_at"`
	ResolutionNote string    `json:"resolution_note"`
	Status         string    `json:"status"`
}

type FeedbackRepository interface {
	Create(feedback *Feedback) error
	GetByID(id int) (*Feedback, error)
	GetAll() ([]*Feedback, error)
	Update(feedback *Feedback) error
	Delete(id int) error
}

type FeedbackUsecase interface {
	CreateFeedback(feedback *Feedback) error
	GetFeedbackByID(id int) (*Feedback, error)
	GetAllFeedbacks() ([]*Feedback, error)
	UpdateFeedback(feedback *Feedback) error
	DeleteFeedback(id int) error
}
