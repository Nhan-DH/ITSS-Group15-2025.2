package account_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllAccounts ───────────────────────────────────────────────────────────

func TestGetAllAccounts(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockAccountRepo{
			GetAllFn: func() ([]*entity.Account, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllAccounts()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có account", func(t *testing.T) {
		repo := &mockAccountRepo{
			GetAllFn: func() ([]*entity.Account, error) {
				return []*entity.Account{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllAccounts()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng account", func(t *testing.T) {
		accounts := []*entity.Account{makeAccount(1, 1), makeAccount(2, 2), makeAccount(3, 1)}
		repo := &mockAccountRepo{
			GetAllFn: func() ([]*entity.Account, error) {
				return accounts, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllAccounts()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 accounts, got %d", len(result))
		}
	})
}

// ─── GetAllAccountsPaginated ──────────────────────────────────────────────────

func TestGetAllAccountsPaginated(t *testing.T) {
	tests := []struct {
		name       string
		page       int
		limit      int
		setupMock  func(*mockAccountRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			page: 1, limit: 10,
			setupMock: func(m *mockAccountRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Account, int, error) {
					return nil, 0, errors.New("db pagination error")
				}
			},
			wantErrMsg: "db pagination error",
		},
		{
			name: "trả về đúng danh sách và tổng số",
			page: 1, limit: 5,
			setupMock: func(m *mockAccountRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Account, int, error) {
					return []*entity.Account{makeAccount(1, 1), makeAccount(2, 2)}, 8, nil
				}
			},
			wantCount: 2, wantTotal: 8,
		},
		{
			name: "phân trang: repo nhận đúng page và limit",
			page: 2, limit: 3,
			setupMock: func(m *mockAccountRepo) {
				m.GetAllPaginatedFn = func(page, limit int) ([]*entity.Account, int, error) {
					if page != 2 || limit != 3 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.Account{makeAccount(4, 1)}, 7, nil
				}
			},
			wantCount: 1, wantTotal: 7,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockAccountRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, total, err := newTestUsecase(repo).GetAllAccountsPaginated(tt.page, tt.limit)

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
