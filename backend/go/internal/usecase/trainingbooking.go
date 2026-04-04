package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type TrainingBookingUsecase interface {
	CreateTrainingBooking(trainingBooking *entity.TrainingBooking) error
	GetTrainingBookingByID(id int) (*entity.TrainingBooking, error)
	GetAllTrainingBookings() ([]*entity.TrainingBooking, error)
	UpdateTrainingBooking(trainingBooking *entity.TrainingBooking) error
	DeleteTrainingBooking(id int) error
}

type trainingBookingUsecase struct {
	repo adapter.TrainingBookingRepository
}

func NewTrainingBookingUsecase(repo adapter.TrainingBookingRepository) TrainingBookingUsecase {
	return &trainingBookingUsecase{repo: repo}
}

func (u *trainingBookingUsecase) CreateTrainingBooking(trainingBooking *entity.TrainingBooking) error {
	return u.repo.Create(trainingBooking)
}

func (u *trainingBookingUsecase) GetTrainingBookingByID(id int) (*entity.TrainingBooking, error) {
	return u.repo.GetByID(id)
}

func (u *trainingBookingUsecase) GetAllTrainingBookings() ([]*entity.TrainingBooking, error) {
	return u.repo.GetAll()
}

func (u *trainingBookingUsecase) UpdateTrainingBooking(trainingBooking *entity.TrainingBooking) error {
	return u.repo.Update(trainingBooking)
}

func (u *trainingBookingUsecase) DeleteTrainingBooking(id int) error {
	return u.repo.Delete(id)
}
