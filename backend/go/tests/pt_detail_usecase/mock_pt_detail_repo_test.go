package pt_detail_test

import "gym-management/internal/domain/entity"

type mockPTDetailRepo struct {
	CreateFn         func(ptd *entity.PTDetail) error
	GetByIDFn        func(id int) (*entity.PTDetail, error)
	GetByAccountIDFn func(accountID int) (*entity.PTDetail, error)
	GetAllFn         func() ([]*entity.PTDetail, error)
	UpdateFn         func(ptd *entity.PTDetail) error
	DeleteFn         func(id int) error
}

func (m *mockPTDetailRepo) Create(ptd *entity.PTDetail) error {
	if m.CreateFn != nil {
		return m.CreateFn(ptd)
	}
	return nil
}

func (m *mockPTDetailRepo) GetByID(id int) (*entity.PTDetail, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockPTDetailRepo) GetByAccountID(accountID int) (*entity.PTDetail, error) {
	if m.GetByAccountIDFn != nil {
		return m.GetByAccountIDFn(accountID)
	}
	return nil, nil
}

func (m *mockPTDetailRepo) GetAll() ([]*entity.PTDetail, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockPTDetailRepo) Update(ptd *entity.PTDetail) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(ptd)
	}
	return nil
}

func (m *mockPTDetailRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
