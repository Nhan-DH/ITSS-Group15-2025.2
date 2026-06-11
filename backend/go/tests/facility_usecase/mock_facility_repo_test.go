package facility_test

import "gym-management/internal/domain/entity"

type mockFacilityRepo struct {
	CreateFn          func(facility *entity.Facility) error
	GetByIDFn         func(id int) (*entity.Facility, error)
	GetAllFn          func() ([]*entity.Facility, error)
	GetAllPaginatedFn func(page, limit int) ([]*entity.Facility, int, error)
	UpdateFn          func(facility *entity.Facility) error
	UpdateStatusFn    func(id int, status string) error
	DeleteFn          func(id int) error
}

func (m *mockFacilityRepo) Create(facility *entity.Facility) error {
	if m.CreateFn != nil {
		return m.CreateFn(facility)
	}
	return nil
}

func (m *mockFacilityRepo) GetByID(id int) (*entity.Facility, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockFacilityRepo) GetAll() ([]*entity.Facility, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockFacilityRepo) GetAllPaginated(page, limit int) ([]*entity.Facility, int, error) {
	if m.GetAllPaginatedFn != nil {
		return m.GetAllPaginatedFn(page, limit)
	}
	return nil, 0, nil
}

func (m *mockFacilityRepo) Update(facility *entity.Facility) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(facility)
	}
	return nil
}

func (m *mockFacilityRepo) UpdateStatus(id int, status string) error {
	if m.UpdateStatusFn != nil {
		return m.UpdateStatusFn(id, status)
	}
	return nil
}

func (m *mockFacilityRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
