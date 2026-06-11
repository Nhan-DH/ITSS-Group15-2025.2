package pt_detail_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllPTDetails ──────────────────────────────────────────────────────────

func TestGetAllPTDetails(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockPTDetailRepo{
			GetAllFn: func() ([]*entity.PTDetail, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllPTDetails()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có pt detail", func(t *testing.T) {
		repo := &mockPTDetailRepo{
			GetAllFn: func() ([]*entity.PTDetail, error) {
				return []*entity.PTDetail{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllPTDetails()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng pt detail", func(t *testing.T) {
		details := []*entity.PTDetail{makeDetail(1), makeDetail(2), makeDetail(3)}
		repo := &mockPTDetailRepo{
			GetAllFn: func() ([]*entity.PTDetail, error) {
				return details, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllPTDetails()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 pt details, got %d", len(result))
		}
	})
}

// ─── GetMyPTDetail ────────────────────────────────────────────────────────────

func TestGetMyPTDetail(t *testing.T) {
	tests := []struct {
		name       string
		accountID  int
		setupMock  func(*mockPTDetailRepo)
		wantErrMsg string
		wantEmpID  int
	}{
		{
			name:       "accountID = 0 trả về invalid accountID",
			accountID:  0,
			wantErrMsg: "invalid accountID",
		},
		{
			name:       "accountID âm trả về invalid accountID",
			accountID:  -3,
			wantErrMsg: "invalid accountID",
		},
		{
			name:      "lỗi repo trả về lỗi gốc",
			accountID: 1,
			setupMock: func(m *mockPTDetailRepo) {
				m.GetByAccountIDFn = func(_ int) (*entity.PTDetail, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name:      "lấy pt detail theo accountID thành công",
			accountID: 7,
			setupMock: func(m *mockPTDetailRepo) {
				m.GetByAccountIDFn = func(_ int) (*entity.PTDetail, error) {
					return makeDetail(10), nil
				}
			},
			wantEmpID: 10,
		},
		{
			name:      "repo nhận đúng accountID",
			accountID: 42,
			setupMock: func(m *mockPTDetailRepo) {
				m.GetByAccountIDFn = func(accountID int) (*entity.PTDetail, error) {
					if accountID != 42 {
						return nil, errors.New("wrong accountID passed to repo")
					}
					return makeDetail(20), nil
				}
			},
			wantEmpID: 20,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPTDetailRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetMyPTDetail(tt.accountID)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil pt detail")
				}
				if result.EmployeeID != tt.wantEmpID {
					t.Errorf("EmployeeID: got %d, want %d", result.EmployeeID, tt.wantEmpID)
				}
			}
		})
	}
}
