package service_category_test

import "gym-management/internal/domain/entity"

type mockServiceCategoryRepo struct {
	CreateFn  func(sc *entity.ServiceCategory) error
	GetByIDFn func(id int) (*entity.ServiceCategory, error)
	GetAllFn  func() ([]*entity.ServiceCategory, error)
	UpdateFn  func(sc *entity.ServiceCategory) error
	DeleteFn  func(id int) error
}

func (m *mockServiceCategoryRepo) Create(sc *entity.ServiceCategory) error {
	if m.CreateFn != nil {
		return m.CreateFn(sc)
	}
	return nil
}

func (m *mockServiceCategoryRepo) GetByID(id int) (*entity.ServiceCategory, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockServiceCategoryRepo) GetAll() ([]*entity.ServiceCategory, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockServiceCategoryRepo) Update(sc *entity.ServiceCategory) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(sc)
	}
	return nil
}

func (m *mockServiceCategoryRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
