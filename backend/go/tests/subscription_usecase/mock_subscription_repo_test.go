package subscription_test

import (
	"time"

	"gym-management/internal/domain/entity"
)

type mockSubscriptionRepo struct {
	CreateFn                          func(sub *entity.Subscription) error
	GetByIDFn                         func(id int) (*entity.Subscription, error)
	GetAllFn                          func() ([]*entity.Subscription, error)
	UpdateFn                          func(sub *entity.Subscription) error
	DeleteFn                          func(id int) error
	GetByMemberIDFn                   func(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error)
	GetActiveByMemberIDFn             func(memberID int) (*entity.Subscription, error)
	GetActiveByMemberIDAndCategoryIDFn func(memberID, categoryID int) (*entity.Subscription, error)
	RenewFn                           func(id int, newEndDate time.Time) error
	UpgradeFn                         func(id, newPackageID int, newEndDate time.Time) error
}

func (m *mockSubscriptionRepo) Create(sub *entity.Subscription) error {
	if m.CreateFn != nil {
		return m.CreateFn(sub)
	}
	return nil
}

func (m *mockSubscriptionRepo) GetByID(id int) (*entity.Subscription, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockSubscriptionRepo) GetAll() ([]*entity.Subscription, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockSubscriptionRepo) Update(sub *entity.Subscription) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(sub)
	}
	return nil
}

func (m *mockSubscriptionRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}

func (m *mockSubscriptionRepo) GetByMemberID(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error) {
	if m.GetByMemberIDFn != nil {
		return m.GetByMemberIDFn(memberID, page, limit)
	}
	return nil, 0, nil
}

func (m *mockSubscriptionRepo) GetActiveByMemberID(memberID int) (*entity.Subscription, error) {
	if m.GetActiveByMemberIDFn != nil {
		return m.GetActiveByMemberIDFn(memberID)
	}
	return nil, nil
}

func (m *mockSubscriptionRepo) GetActiveByMemberIDAndCategoryID(memberID, categoryID int) (*entity.Subscription, error) {
	if m.GetActiveByMemberIDAndCategoryIDFn != nil {
		return m.GetActiveByMemberIDAndCategoryIDFn(memberID, categoryID)
	}
	return nil, nil
}

func (m *mockSubscriptionRepo) Renew(id int, newEndDate time.Time) error {
	if m.RenewFn != nil {
		return m.RenewFn(id, newEndDate)
	}
	return nil
}

func (m *mockSubscriptionRepo) Upgrade(id, newPackageID int, newEndDate time.Time) error {
	if m.UpgradeFn != nil {
		return m.UpgradeFn(id, newPackageID, newEndDate)
	}
	return nil
}
