package role_test

import "gym-management/internal/domain/entity"

type mockRoleRepo struct {
	CreateFn  func(role *entity.Role) error
	GetByIDFn func(id int) (*entity.Role, error)
	GetAllFn  func() ([]*entity.Role, error)
	UpdateFn  func(role *entity.Role) error
	DeleteFn  func(id int) error
}

func (m *mockRoleRepo) Create(role *entity.Role) error {
	if m.CreateFn != nil {
		return m.CreateFn(role)
	}
	return nil
}

func (m *mockRoleRepo) GetByID(id int) (*entity.Role, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockRoleRepo) GetAll() ([]*entity.Role, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockRoleRepo) Update(role *entity.Role) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(role)
	}
	return nil
}

func (m *mockRoleRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
