package equipment_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateEquipment ──────────────────────────────────────────────────────────

func TestCreateEquipment(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockEquipmentRepo{
			CreateFn: func(_ *entity.Equipment) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateEquipment(makeEquipment(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo equipment thành công", func(t *testing.T) {
		repo := &mockEquipmentRepo{}
		err := newTestUsecase(repo).CreateEquipment(makeEquipment(1))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, pointer được cập nhật", func(t *testing.T) {
		repo := &mockEquipmentRepo{
			CreateFn: func(e *entity.Equipment) error {
				e.ID = 42
				return nil
			},
		}
		eq := makeEquipment(0)
		err := newTestUsecase(repo).CreateEquipment(eq)
		assertNoError(t, err)
		if eq.ID != 42 {
			t.Errorf("expected ID = 42 after create, got %d", eq.ID)
		}
	})
}

// ─── GetEquipmentByID ─────────────────────────────────────────────────────────

func TestGetEquipmentByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockEquipmentRepo)
		wantErrMsg string
		wantID     int
	}{
		{
			name:       "id = 0 trả về invalid id",
			id:         0,
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			id:         -9,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockEquipmentRepo) {
				m.GetByIDFn = func(_ int) (*entity.Equipment, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy equipment thành công",
			id:   3,
			setupMock: func(m *mockEquipmentRepo) {
				m.GetByIDFn = func(id int) (*entity.Equipment, error) {
					return makeEquipment(id), nil
				}
			},
			wantID: 3,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEquipmentRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetEquipmentByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil equipment")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdateEquipment ──────────────────────────────────────────────────────────

func TestUpdateEquipment(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.Equipment
		setupMock  func(*mockEquipmentRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			input:      makeEquipment(0),
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			input:      makeEquipment(-5),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeEquipment(2),
			setupMock: func(m *mockEquipmentRepo) {
				m.UpdateFn = func(_ *entity.Equipment) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật equipment thành công",
			input:     makeEquipment(7),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEquipmentRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateEquipment(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockEquipmentRepo{
			UpdateFn: func(e *entity.Equipment) error {
				e.EquipmentName = "Rowing Machine"
				e.Status = "Under maintenance"
				return nil
			},
		}
		eq := makeEquipment(5)
		err := newTestUsecase(repo).UpdateEquipment(eq)
		assertNoError(t, err)
		if eq.EquipmentName != "Rowing Machine" {
			t.Errorf("expected EquipmentName = 'Rowing Machine', got %q", eq.EquipmentName)
		}
		if eq.Status != "Under maintenance" {
			t.Errorf("expected Status = 'Under maintenance', got %q", eq.Status)
		}
	})
}

// ─── DeleteEquipment ──────────────────────────────────────────────────────────

func TestDeleteEquipment(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockEquipmentRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			id:         0,
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			id:         -2,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   4,
			setupMock: func(m *mockEquipmentRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá equipment thành công",
			id:        10,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEquipmentRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteEquipment(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
