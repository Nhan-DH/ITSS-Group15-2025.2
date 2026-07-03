package member_test

import (
	"gym-management/internal/domain/entity"
	"gym-management/internal/infra/api/dto"
)

type mockMemberRepo struct {
	CreateFn                   func(member *entity.Member) error
	GetByIDFn                  func(id int) (*entity.Member, error)
	GetAllFn                   func() ([]*entity.Member, error)
	GetAllPaginatedFn          func(page, limit int) ([]*entity.Member, int, error)
	GetAllMembersWithDetailsFn func() ([]*dto.MemberListItemDTO, error)
	GetMemberByIDWithDetailsFn func(id int) (*dto.MemberDetailDTO, error)
	UpdateFn                   func(member *entity.Member) error
	UpdateStatusFn             func(id int, isActive bool) error
	GetByAccountIDFn           func(accountID int) (*entity.Member, error)
	DeleteFn                   func(id int) error
}

func (m *mockMemberRepo) Create(member *entity.Member) error {
	if m.CreateFn != nil {
		return m.CreateFn(member)
	}
	return nil
}

func (m *mockMemberRepo) GetByID(id int) (*entity.Member, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockMemberRepo) GetAll() ([]*entity.Member, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockMemberRepo) GetAllPaginated(page, limit int) ([]*entity.Member, int, error) {
	if m.GetAllPaginatedFn != nil {
		return m.GetAllPaginatedFn(page, limit)
	}
	return nil, 0, nil
}

func (m *mockMemberRepo) GetAllMembersWithDetails() ([]*dto.MemberListItemDTO, error) {
	if m.GetAllMembersWithDetailsFn != nil {
		return m.GetAllMembersWithDetailsFn()
	}
	return nil, nil
}

func (m *mockMemberRepo) GetMemberByIDWithDetails(id int) (*dto.MemberDetailDTO, error) {
	if m.GetMemberByIDWithDetailsFn != nil {
		return m.GetMemberByIDWithDetailsFn(id)
	}
	return nil, nil
}

func (m *mockMemberRepo) Update(member *entity.Member) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(member)
	}
	return nil
}

func (m *mockMemberRepo) UpdateStatus(id int, isActive bool) error {
	if m.UpdateStatusFn != nil {
		return m.UpdateStatusFn(id, isActive)
	}
	return nil
}

func (m *mockMemberRepo) GetByAccountID(accountID int) (*entity.Member, error) {
	if m.GetByAccountIDFn != nil {
		return m.GetByAccountIDFn(accountID)
	}
	return nil, nil
}

func (m *mockMemberRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
