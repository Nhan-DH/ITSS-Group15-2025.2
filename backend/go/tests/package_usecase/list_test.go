package package_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllPackages ───────────────────────────────────────────────────────────

func TestGetAllPackages(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockPackageRepo{
			GetAllFn: func() ([]*entity.MembershipPackage, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllPackages()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có package", func(t *testing.T) {
		repo := &mockPackageRepo{
			GetAllFn: func() ([]*entity.MembershipPackage, error) {
				return []*entity.MembershipPackage{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllPackages()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng package", func(t *testing.T) {
		pkgs := []*entity.MembershipPackage{makePkg(1, 1), makePkg(2, 1), makePkg(3, 2)}
		repo := &mockPackageRepo{
			GetAllFn: func() ([]*entity.MembershipPackage, error) {
				return pkgs, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllPackages()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 packages, got %d", len(result))
		}
	})
}

// ─── GetAllPackagesPaginated ──────────────────────────────────────────────────

func TestGetAllPackagesPaginated(t *testing.T) {
	tests := []struct {
		name       string
		page       int
		limit      int
		setupMock  func(*mockPackageRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			page: 1, limit: 10,
			setupMock: func(m *mockPackageRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.MembershipPackage, int, error) {
					return nil, 0, errors.New("db pagination error")
				}
			},
			wantErrMsg: "db pagination error",
		},
		{
			name: "trả về đúng danh sách và tổng số",
			page: 1, limit: 5,
			setupMock: func(m *mockPackageRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.MembershipPackage, int, error) {
					return []*entity.MembershipPackage{makePkg(1, 1), makePkg(2, 2)}, 8, nil
				}
			},
			wantCount: 2, wantTotal: 8,
		},
		{
			name: "phân trang: repo nhận đúng page và limit",
			page: 2, limit: 3,
			setupMock: func(m *mockPackageRepo) {
				m.GetAllPaginatedFn = func(page, limit int) ([]*entity.MembershipPackage, int, error) {
					if page != 2 || limit != 3 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.MembershipPackage{makePkg(4, 1)}, 7, nil
				}
			},
			wantCount: 1, wantTotal: 7,
		},
		{
			name: "trang cuối trả về ít phần tử hơn limit",
			page: 3, limit: 5,
			setupMock: func(m *mockPackageRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.MembershipPackage, int, error) {
					return []*entity.MembershipPackage{makePkg(11, 1), makePkg(12, 2)}, 12, nil
				}
			},
			wantCount: 2, wantTotal: 12,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPackageRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, total, err := newTestUsecase(repo).GetAllPackagesPaginated(tt.page, tt.limit)

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
