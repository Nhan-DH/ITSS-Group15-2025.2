package account_test

import "gym-management/internal/domain/entity"

type mockAccountRepo struct {
	CreateFn          func(account *entity.Account) error
	GetByIDFn         func(id int) (*entity.Account, error)
	GetAllFn          func() ([]*entity.Account, error)
	GetAllPaginatedFn func(page, limit int) ([]*entity.Account, int, error)
	UpdateFn          func(account *entity.Account) error
	DeleteFn          func(id int) error
}

func (m *mockAccountRepo) Create(account *entity.Account) error {
	if m.CreateFn != nil {
		return m.CreateFn(account)
	}
	return nil
}

func (m *mockAccountRepo) GetByID(id int) (*entity.Account, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockAccountRepo) GetAll() ([]*entity.Account, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockAccountRepo) GetAllPaginated(page, limit int) ([]*entity.Account, int, error) {
	if m.GetAllPaginatedFn != nil {
		return m.GetAllPaginatedFn(page, limit)
	}
	return nil, 0, nil
}

func (m *mockAccountRepo) Update(account *entity.Account) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(account)
	}
	return nil
}

func (m *mockAccountRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
