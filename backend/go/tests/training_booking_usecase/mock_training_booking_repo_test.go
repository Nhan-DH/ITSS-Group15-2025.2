package training_booking_test

import "gym-management/internal/domain/entity"

type mockTrainingBookingRepo struct {
	CreateFn  func(tb *entity.TrainingBooking) error
	GetByIDFn func(id int) (*entity.TrainingBooking, error)
	GetAllFn  func() ([]*entity.TrainingBooking, error)
	UpdateFn  func(tb *entity.TrainingBooking) error
	DeleteFn  func(id int) error
}

func (m *mockTrainingBookingRepo) Create(tb *entity.TrainingBooking) error {
	if m.CreateFn != nil {
		return m.CreateFn(tb)
	}
	return nil
}

func (m *mockTrainingBookingRepo) GetByID(id int) (*entity.TrainingBooking, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockTrainingBookingRepo) GetAll() ([]*entity.TrainingBooking, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockTrainingBookingRepo) Update(tb *entity.TrainingBooking) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(tb)
	}
	return nil
}

func (m *mockTrainingBookingRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
