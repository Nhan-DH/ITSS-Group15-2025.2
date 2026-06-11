package employee_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllEmployees ──────────────────────────────────────────────────────────

func TestGetAllEmployees(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockEmployeeRepo{
			GetAllFn: func() ([]*entity.Employee, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllEmployees()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có employee", func(t *testing.T) {
		repo := &mockEmployeeRepo{
			GetAllFn: func() ([]*entity.Employee, error) {
				return []*entity.Employee{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllEmployees()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng employee", func(t *testing.T) {
		employees := []*entity.Employee{makeEmployee(1, 1), makeEmployee(2, 2), makeEmployee(3, 3)}
		repo := &mockEmployeeRepo{
			GetAllFn: func() ([]*entity.Employee, error) {
				return employees, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllEmployees()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 employees, got %d", len(result))
		}
	})
}

// ─── GetAllEmployeesPaginated ─────────────────────────────────────────────────

func TestGetAllEmployeesPaginated(t *testing.T) {
	tests := []struct {
		name       string
		page       int
		limit      int
		setupMock  func(*mockEmployeeRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			page: 1, limit: 10,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Employee, int, error) {
					return nil, 0, errors.New("db pagination error")
				}
			},
			wantErrMsg: "db pagination error",
		},
		{
			name: "trả về đúng danh sách và tổng số",
			page: 1, limit: 5,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Employee, int, error) {
					return []*entity.Employee{makeEmployee(1, 1), makeEmployee(2, 2)}, 8, nil
				}
			},
			wantCount: 2, wantTotal: 8,
		},
		{
			name: "phân trang: repo nhận đúng page và limit",
			page: 2, limit: 4,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetAllPaginatedFn = func(page, limit int) ([]*entity.Employee, int, error) {
					if page != 2 || limit != 4 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.Employee{makeEmployee(5, 5)}, 12, nil
				}
			},
			wantCount: 1, wantTotal: 12,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEmployeeRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, total, err := newTestUsecase(repo).GetAllEmployeesPaginated(tt.page, tt.limit)

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

// ─── GetEmployeeByAccountID ───────────────────────────────────────────────────

func TestGetEmployeeByAccountID(t *testing.T) {
	tests := []struct {
		name       string
		accountID  int
		setupMock  func(*mockEmployeeRepo)
		wantErrMsg string
		wantAccID  int
	}{
		{
			name:      "lỗi repo trả về lỗi gốc",
			accountID: 1,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetByAccountIDFn = func(_ int) (*entity.Employee, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name:      "lấy employee thành công theo accountID",
			accountID: 5,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetByAccountIDFn = func(accountID int) (*entity.Employee, error) {
					return makeEmployee(10, accountID), nil
				}
			},
			wantAccID: 5,
		},
		{
			name:      "repo nhận đúng accountID",
			accountID: 99,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetByAccountIDFn = func(accountID int) (*entity.Employee, error) {
					if accountID != 99 {
						return nil, errors.New("wrong accountID passed to repo")
					}
					return makeEmployee(20, accountID), nil
				}
			},
			wantAccID: 99,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEmployeeRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetEmployeeByAccountID(tt.accountID)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil employee")
				}
				if result.AccountID != tt.wantAccID {
					t.Errorf("AccountID: got %d, want %d", result.AccountID, tt.wantAccID)
				}
			}
		})
	}
}
