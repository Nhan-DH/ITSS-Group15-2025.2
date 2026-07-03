package facility_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllFacilities ─────────────────────────────────────────────────────────

func TestGetAllFacilities(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockFacilityRepo{
			GetAllFn: func() ([]*entity.Facility, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllFacilities()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có facility", func(t *testing.T) {
		repo := &mockFacilityRepo{
			GetAllFn: func() ([]*entity.Facility, error) {
				return []*entity.Facility{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllFacilities()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng facility", func(t *testing.T) {
		facilities := []*entity.Facility{makeFacility(1), makeFacility(2), makeFacility(3)}
		repo := &mockFacilityRepo{
			GetAllFn: func() ([]*entity.Facility, error) {
				return facilities, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllFacilities()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 facilities, got %d", len(result))
		}
	})
}

// ─── GetAllFacilitiesPaginated ────────────────────────────────────────────────

func TestGetAllFacilitiesPaginated(t *testing.T) {
	tests := []struct {
		name       string
		page       int
		limit      int
		setupMock  func(*mockFacilityRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			page: 1, limit: 10,
			setupMock: func(m *mockFacilityRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Facility, int, error) {
					return nil, 0, errors.New("db pagination error")
				}
			},
			wantErrMsg: "db pagination error",
		},
		{
			name: "trả về đúng danh sách và tổng số",
			page: 1, limit: 5,
			setupMock: func(m *mockFacilityRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Facility, int, error) {
					return []*entity.Facility{makeFacility(1), makeFacility(2)}, 6, nil
				}
			},
			wantCount: 2, wantTotal: 6,
		},
		{
			name: "phân trang: repo nhận đúng page và limit",
			page: 3, limit: 4,
			setupMock: func(m *mockFacilityRepo) {
				m.GetAllPaginatedFn = func(page, limit int) ([]*entity.Facility, int, error) {
					if page != 3 || limit != 4 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.Facility{makeFacility(9)}, 9, nil
				}
			},
			wantCount: 1, wantTotal: 9,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFacilityRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, total, err := newTestUsecase(repo).GetAllFacilitiesPaginated(tt.page, tt.limit)

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
