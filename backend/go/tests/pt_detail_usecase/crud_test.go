package pt_detail_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreatePTDetail ───────────────────────────────────────────────────────────

func TestCreatePTDetail(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockPTDetailRepo{
			CreateFn: func(_ *entity.PTDetail) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreatePTDetail(makeDetail(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo pt detail thành công", func(t *testing.T) {
		repo := &mockPTDetailRepo{}
		err := newTestUsecase(repo).CreatePTDetail(makeDetail(1))
		assertNoError(t, err)
	})

	t.Run("repo gán EmployeeID sau khi tạo, pointer được cập nhật", func(t *testing.T) {
		repo := &mockPTDetailRepo{
			CreateFn: func(ptd *entity.PTDetail) error {
				ptd.EmployeeID = 77
				return nil
			},
		}
		ptd := makeDetail(0)
		err := newTestUsecase(repo).CreatePTDetail(ptd)
		assertNoError(t, err)
		if ptd.EmployeeID != 77 {
			t.Errorf("expected EmployeeID = 77 after create, got %d", ptd.EmployeeID)
		}
	})
}

// ─── GetPTDetailByID ──────────────────────────────────────────────────────────

func TestGetPTDetailByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockPTDetailRepo)
		wantErrMsg string
		wantEmpID  int
	}{
		{
			name:       "employeeID = 0 trả về invalid employeeID",
			id:         0,
			wantErrMsg: "invalid employeeID",
		},
		{
			name:       "employeeID âm trả về invalid employeeID",
			id:         -4,
			wantErrMsg: "invalid employeeID",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockPTDetailRepo) {
				m.GetByIDFn = func(_ int) (*entity.PTDetail, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy pt detail thành công",
			id:   5,
			setupMock: func(m *mockPTDetailRepo) {
				m.GetByIDFn = func(id int) (*entity.PTDetail, error) {
					return makeDetail(id), nil
				}
			},
			wantEmpID: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPTDetailRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetPTDetailByID(tt.id)

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

// ─── UpdatePTDetail ───────────────────────────────────────────────────────────

func TestUpdatePTDetail(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.PTDetail
		setupMock  func(*mockPTDetailRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "EmployeeID = 0 trả về invalid employeeID",
			input:      makeDetail(0),
			wantErrMsg: "invalid employeeID",
		},
		{
			name:       "EmployeeID âm trả về invalid employeeID",
			input:      makeDetail(-2),
			wantErrMsg: "invalid employeeID",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeDetail(3),
			setupMock: func(m *mockPTDetailRepo) {
				m.UpdateFn = func(_ *entity.PTDetail) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật pt detail thành công",
			input:     makeDetail(6),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPTDetailRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdatePTDetail(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockPTDetailRepo{
			UpdateFn: func(ptd *entity.PTDetail) error {
				ptd.ProfessionalProfile = "Updated profile"
				ptd.Achievements = "Gold medal 2024"
				return nil
			},
		}
		ptd := makeDetail(8)
		err := newTestUsecase(repo).UpdatePTDetail(ptd)
		assertNoError(t, err)
		if ptd.ProfessionalProfile != "Updated profile" {
			t.Errorf("expected ProfessionalProfile = 'Updated profile', got %q", ptd.ProfessionalProfile)
		}
		if ptd.Achievements != "Gold medal 2024" {
			t.Errorf("expected Achievements = 'Gold medal 2024', got %q", ptd.Achievements)
		}
	})
}

// ─── DeletePTDetail ───────────────────────────────────────────────────────────

func TestDeletePTDetail(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockPTDetailRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "employeeID = 0 trả về invalid employeeID",
			id:         0,
			wantErrMsg: "invalid employeeID",
		},
		{
			name:       "employeeID âm trả về invalid employeeID",
			id:         -1,
			wantErrMsg: "invalid employeeID",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   2,
			setupMock: func(m *mockPTDetailRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá pt detail thành công",
			id:        9,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPTDetailRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeletePTDetail(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
