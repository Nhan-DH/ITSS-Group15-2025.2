package member_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
	"gym-management/internal/infra/api/dto"
)

// ─── GetAllMembers ────────────────────────────────────────────────────────────

func TestGetAllMembers(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockMemberRepo{
			GetAllFn: func() ([]*entity.Member, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllMembers()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có member", func(t *testing.T) {
		repo := &mockMemberRepo{
			GetAllFn: func() ([]*entity.Member, error) {
				return []*entity.Member{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllMembers()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng member", func(t *testing.T) {
		members := []*entity.Member{makeMember(1, 1), makeMember(2, 2), makeMember(3, 3)}
		repo := &mockMemberRepo{
			GetAllFn: func() ([]*entity.Member, error) {
				return members, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllMembers()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 members, got %d", len(result))
		}
	})
}

// ─── GetAllMembersPaginated ───────────────────────────────────────────────────

func TestGetAllMembersPaginated(t *testing.T) {
	tests := []struct {
		name       string
		page       int
		limit      int
		setupMock  func(*mockMemberRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			page: 1, limit: 10,
			setupMock: func(m *mockMemberRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Member, int, error) {
					return nil, 0, errors.New("db pagination error")
				}
			},
			wantErrMsg: "db pagination error",
		},
		{
			name: "trả về đúng danh sách và tổng số",
			page: 1, limit: 5,
			setupMock: func(m *mockMemberRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Member, int, error) {
					return []*entity.Member{makeMember(1, 1), makeMember(2, 2)}, 10, nil
				}
			},
			wantCount: 2, wantTotal: 10,
		},
		{
			name: "phân trang: repo nhận đúng page và limit",
			page: 3, limit: 5,
			setupMock: func(m *mockMemberRepo) {
				m.GetAllPaginatedFn = func(page, limit int) ([]*entity.Member, int, error) {
					if page != 3 || limit != 5 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.Member{makeMember(11, 11)}, 15, nil
				}
			},
			wantCount: 1, wantTotal: 15,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockMemberRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, total, err := newTestUsecase(repo).GetAllMembersPaginated(tt.page, tt.limit)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				return
			}
			assertNoError(t, err)
			if len(result) != tt.wantCount {
				t.Errorf("result count: got %d, want %d", len(result), tt.wantCount)
			}
			if total != tt.wantTotal {
				t.Errorf("total: got %d, want %d", total, tt.wantTotal)
			}
		})
	}
}

// ─── GetAllMembersWithDetails ─────────────────────────────────────────────────

func TestGetAllMembersWithDetails(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockMemberRepo{
			GetAllMembersWithDetailsFn: func() ([]*dto.MemberListItemDTO, error) {
				return nil, errors.New("db detail error")
			},
		}
		_, err := newTestUsecase(repo).GetAllMembersWithDetails()
		assertErrorMsg(t, err, "db detail error")
	})

	t.Run("trả về danh sách rỗng", func(t *testing.T) {
		repo := &mockMemberRepo{
			GetAllMembersWithDetailsFn: func() ([]*dto.MemberListItemDTO, error) {
				return []*dto.MemberListItemDTO{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllMembersWithDetails()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng danh sách DTO", func(t *testing.T) {
		dtos := []*dto.MemberListItemDTO{
			{ID: 1, Name: "Alice", Phone: "0111111111", Package: "Basic", Status: "active"},
			{ID: 2, Name: "Bob", Phone: "0222222222", Package: "Premium", Status: "inactive"},
		}
		repo := &mockMemberRepo{
			GetAllMembersWithDetailsFn: func() ([]*dto.MemberListItemDTO, error) {
				return dtos, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllMembersWithDetails()
		assertNoError(t, err)
		if len(result) != 2 {
			t.Errorf("expected 2 DTOs, got %d", len(result))
		}
		if result[0].Name != "Alice" {
			t.Errorf("expected first Name = 'Alice', got %q", result[0].Name)
		}
	})
}

// ─── GetMemberByIDWithDetails ─────────────────────────────────────────────────

func TestGetMemberByIDWithDetails(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockMemberRepo)
		wantErrMsg string
		wantID     int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockMemberRepo) {
				m.GetMemberByIDWithDetailsFn = func(_ int) (*dto.MemberDetailDTO, error) {
					return nil, errors.New("member not found")
				}
			},
			wantErrMsg: "member not found",
		},
		{
			name: "lấy chi tiết member thành công",
			id:   5,
			setupMock: func(m *mockMemberRepo) {
				m.GetMemberByIDWithDetailsFn = func(id int) (*dto.MemberDetailDTO, error) {
					return &dto.MemberDetailDTO{ID: id, FullName: "Test", Status: "active"}, nil
				}
			},
			wantID: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockMemberRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetMemberByIDWithDetails(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
				return
			}
			assertNoError(t, err)
			if result == nil {
				t.Fatal("expected non-nil MemberDetailDTO")
			}
			if result.ID != tt.wantID {
				t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
			}
		})
	}
}

// ─── GetMemberByAccountID ─────────────────────────────────────────────────────

func TestGetMemberByAccountID(t *testing.T) {
	tests := []struct {
		name       string
		accountID  int
		setupMock  func(*mockMemberRepo)
		wantErrMsg string
		wantAccID  int
	}{
		{
			name:      "lỗi repo trả về lỗi gốc",
			accountID: 1,
			setupMock: func(m *mockMemberRepo) {
				m.GetByAccountIDFn = func(_ int) (*entity.Member, error) {
					return nil, errors.New("account not found")
				}
			},
			wantErrMsg: "account not found",
		},
		{
			name:      "lấy member theo accountID thành công",
			accountID: 10,
			setupMock: func(m *mockMemberRepo) {
				m.GetByAccountIDFn = func(accountID int) (*entity.Member, error) {
					return makeMember(3, accountID), nil
				}
			},
			wantAccID: 10,
		},
		{
			name:      "repo nhận đúng accountID",
			accountID: 7,
			setupMock: func(m *mockMemberRepo) {
				m.GetByAccountIDFn = func(accountID int) (*entity.Member, error) {
					if accountID != 7 {
						return nil, errors.New("wrong accountID passed to repo")
					}
					return makeMember(20, accountID), nil
				}
			},
			wantAccID: 7,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockMemberRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetMemberByAccountID(tt.accountID)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
				return
			}
			assertNoError(t, err)
			if result == nil {
				t.Fatal("expected non-nil member")
			}
			if result.AccountID != tt.wantAccID {
				t.Errorf("AccountID: got %d, want %d", result.AccountID, tt.wantAccID)
			}
		})
	}
}
