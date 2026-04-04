package usecase

import "gym-management/internal/domain/entity"

type TrainingBookingUsecase interface {
	CreateTrainingBooking(tb *entity.TrainingBooking) error
	GetTrainingBookingByID(id int) (*entity.TrainingBooking, error)
	GetAllTrainingBookings() ([]*entity.TrainingBooking, error)
	UpdateTrainingBooking(tb *entity.TrainingBooking) error
	DeleteTrainingBooking(id int) error
}
