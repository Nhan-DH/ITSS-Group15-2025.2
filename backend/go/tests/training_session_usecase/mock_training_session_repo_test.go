package training_session_test

import "gym-management/internal/domain/entity"

type mockTrainingSessionRepo struct {
	CreateFn            func(ts *entity.TrainingSession) error
	GetByIDFn           func(id int) (*entity.TrainingSession, error)
	GetAllFn            func() ([]*entity.TrainingSession, error)
	GetByPTEmployeeIDFn func(employeeID int) ([]*entity.TrainingSession, error)
	UpdateFn            func(ts *entity.TrainingSession) error
	DeleteFn            func(id int) error
	ConfirmAttendanceFn func(id int, memberID int) error
}

func (m *mockTrainingSessionRepo) Create(ts *entity.TrainingSession) error {
	if m.CreateFn != nil {
		return m.CreateFn(ts)
	}
	return nil
}

func (m *mockTrainingSessionRepo) GetByID(id int) (*entity.TrainingSession, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockTrainingSessionRepo) GetAll() ([]*entity.TrainingSession, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockTrainingSessionRepo) GetByPTEmployeeID(employeeID int) ([]*entity.TrainingSession, error) {
	if m.GetByPTEmployeeIDFn != nil {
		return m.GetByPTEmployeeIDFn(employeeID)
	}
	return nil, nil
}

func (m *mockTrainingSessionRepo) Update(ts *entity.TrainingSession) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(ts)
	}
	return nil
}

func (m *mockTrainingSessionRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}

func (m *mockTrainingSessionRepo) ConfirmAttendance(id int, memberID int) error {
	if m.ConfirmAttendanceFn != nil {
		return m.ConfirmAttendanceFn(id, memberID)
	}
	return nil
}
