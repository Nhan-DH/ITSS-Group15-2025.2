package employee_test

import "gym-management/internal/domain/entity"

type mockEmployeeRepo struct {
	CreateFn          func(employee *entity.Employee) error
	GetByIDFn         func(id int) (*entity.Employee, error)
	GetByAccountIDFn  func(accountID int) (*entity.Employee, error)
	GetAllFn          func() ([]*entity.Employee, error)
	GetAllPaginatedFn func(page, limit int) ([]*entity.Employee, int, error)
	UpdateFn          func(employee *entity.Employee) error
	DeleteFn          func(id int) error
}

func (m *mockEmployeeRepo) Create(employee *entity.Employee) error {
	if m.CreateFn != nil {
		return m.CreateFn(employee)
	}
	return nil
}

func (m *mockEmployeeRepo) GetByID(id int) (*entity.Employee, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockEmployeeRepo) GetByAccountID(accountID int) (*entity.Employee, error) {
	if m.GetByAccountIDFn != nil {
		return m.GetByAccountIDFn(accountID)
	}
	return nil, nil
}

func (m *mockEmployeeRepo) GetAll() ([]*entity.Employee, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockEmployeeRepo) GetAllPaginated(page, limit int) ([]*entity.Employee, int, error) {
	if m.GetAllPaginatedFn != nil {
		return m.GetAllPaginatedFn(page, limit)
	}
	return nil, 0, nil
}

func (m *mockEmployeeRepo) Update(employee *entity.Employee) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(employee)
	}
	return nil
}

func (m *mockEmployeeRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
