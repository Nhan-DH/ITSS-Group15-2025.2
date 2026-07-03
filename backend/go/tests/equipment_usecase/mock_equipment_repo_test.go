package equipment_test

import "gym-management/internal/domain/entity"

type mockEquipmentRepo struct {
	CreateFn         func(e *entity.Equipment) error
	GetByIDFn        func(id int) (*entity.Equipment, error)
	GetAllFn         func() ([]*entity.Equipment, error)
	GetAllPaginatedFn func(page, limit int) ([]*entity.Equipment, int, error)
	UpdateFn         func(e *entity.Equipment) error
	DeleteFn         func(id int) error
}

func (m *mockEquipmentRepo) Create(e *entity.Equipment) error {
	if m.CreateFn != nil {
		return m.CreateFn(e)
	}
	return nil
}

func (m *mockEquipmentRepo) GetByID(id int) (*entity.Equipment, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockEquipmentRepo) GetAll() ([]*entity.Equipment, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockEquipmentRepo) GetAllPaginated(page, limit int) ([]*entity.Equipment, int, error) {
	if m.GetAllPaginatedFn != nil {
		return m.GetAllPaginatedFn(page, limit)
	}
	return nil, 0, nil
}

func (m *mockEquipmentRepo) Update(e *entity.Equipment) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(e)
	}
	return nil
}

func (m *mockEquipmentRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
