package equipment_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllEquipments ─────────────────────────────────────────────────────────

func TestGetAllEquipments(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockEquipmentRepo{
			GetAllFn: func() ([]*entity.Equipment, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllEquipments()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có equipment", func(t *testing.T) {
		repo := &mockEquipmentRepo{
			GetAllFn: func() ([]*entity.Equipment, error) {
				return []*entity.Equipment{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllEquipments()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng equipment", func(t *testing.T) {
		equipments := []*entity.Equipment{makeEquipment(1), makeEquipment(2), makeEquipment(3)}
		repo := &mockEquipmentRepo{
			GetAllFn: func() ([]*entity.Equipment, error) {
				return equipments, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllEquipments()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 equipments, got %d", len(result))
		}
	})
}

// ─── GetAllEquipmentsPaginated ────────────────────────────────────────────────

func TestGetAllEquipmentsPaginated(t *testing.T) {
	tests := []struct {
		name       string
		page       int
		limit      int
		setupMock  func(*mockEquipmentRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			page: 1, limit: 10,
			setupMock: func(m *mockEquipmentRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Equipment, int, error) {
					return nil, 0, errors.New("db pagination error")
				}
			},
			wantErrMsg: "db pagination error",
		},
		{
			name: "trả về đúng danh sách và tổng số",
			page: 1, limit: 5,
			setupMock: func(m *mockEquipmentRepo) {
				m.GetAllPaginatedFn = func(_, _ int) ([]*entity.Equipment, int, error) {
					return []*entity.Equipment{makeEquipment(1), makeEquipment(2)}, 10, nil
				}
			},
			wantCount: 2, wantTotal: 10,
		},
		{
			name: "phân trang: repo nhận đúng page và limit",
			page: 3, limit: 7,
			setupMock: func(m *mockEquipmentRepo) {
				m.GetAllPaginatedFn = func(page, limit int) ([]*entity.Equipment, int, error) {
					if page != 3 || limit != 7 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.Equipment{makeEquipment(15)}, 25, nil
				}
			},
			wantCount: 1, wantTotal: 25,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEquipmentRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, total, err := newTestUsecase(repo).GetAllEquipmentsPaginated(tt.page, tt.limit)

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
