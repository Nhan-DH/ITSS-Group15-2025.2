package package_test

import "gym-management/internal/domain/entity"

type mockPackageRepo struct {
	CreateFn          func(pkg *entity.MembershipPackage) error
	GetByIDFn         func(id int) (*entity.MembershipPackage, error)
	GetAllFn          func() ([]*entity.MembershipPackage, error)
	GetAllPaginatedFn func(page, limit int) ([]*entity.MembershipPackage, int, error)
	UpdateFn          func(pkg *entity.MembershipPackage) error
	UpdateStatusFn    func(id int, isActive bool) error
	DeleteFn          func(id int) error
}

func (m *mockPackageRepo) Create(pkg *entity.MembershipPackage) error {
	if m.CreateFn != nil {
		return m.CreateFn(pkg)
	}
	return nil
}

func (m *mockPackageRepo) GetByID(id int) (*entity.MembershipPackage, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockPackageRepo) GetAll() ([]*entity.MembershipPackage, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockPackageRepo) GetAllPaginated(page, limit int) ([]*entity.MembershipPackage, int, error) {
	if m.GetAllPaginatedFn != nil {
		return m.GetAllPaginatedFn(page, limit)
	}
	return nil, 0, nil
}

func (m *mockPackageRepo) Update(pkg *entity.MembershipPackage) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(pkg)
	}
	return nil
}

func (m *mockPackageRepo) UpdateStatus(id int, isActive bool) error {
	if m.UpdateStatusFn != nil {
		return m.UpdateStatusFn(id, isActive)
	}
	return nil
}

func (m *mockPackageRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
