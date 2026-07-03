package role_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateRole ───────────────────────────────────────────────────────────────

func TestCreateRole(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockRoleRepo{
			CreateFn: func(_ *entity.Role) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateRole(makeRole(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo role thành công", func(t *testing.T) {
		repo := &mockRoleRepo{}
		err := newTestUsecase(repo).CreateRole(makeRole(1))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, pointer được cập nhật", func(t *testing.T) {
		repo := &mockRoleRepo{
			CreateFn: func(role *entity.Role) error {
				role.ID = 99
				return nil
			},
		}
		role := makeRole(0)
		err := newTestUsecase(repo).CreateRole(role)
		assertNoError(t, err)
		if role.ID != 99 {
			t.Errorf("expected ID = 99 after create, got %d", role.ID)
		}
	})
}

// ─── GetRoleByID ──────────────────────────────────────────────────────────────

func TestGetRoleByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockRoleRepo)
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
			id:         -5,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockRoleRepo) {
				m.GetByIDFn = func(_ int) (*entity.Role, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy role thành công",
			id:   7,
			setupMock: func(m *mockRoleRepo) {
				m.GetByIDFn = func(id int) (*entity.Role, error) {
					return makeRole(id), nil
				}
			},
			wantID: 7,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockRoleRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetRoleByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil role")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── GetAllRoles ──────────────────────────────────────────────────────────────

func TestGetAllRoles(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockRoleRepo{
			GetAllFn: func() ([]*entity.Role, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllRoles()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có role", func(t *testing.T) {
		repo := &mockRoleRepo{
			GetAllFn: func() ([]*entity.Role, error) {
				return []*entity.Role{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllRoles()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng role", func(t *testing.T) {
		roles := []*entity.Role{makeRole(1), makeRole(2), makeRole(3)}
		repo := &mockRoleRepo{
			GetAllFn: func() ([]*entity.Role, error) {
				return roles, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllRoles()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 roles, got %d", len(result))
		}
	})
}

// ─── UpdateRole ───────────────────────────────────────────────────────────────

func TestUpdateRole(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.Role
		setupMock  func(*mockRoleRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			input:      makeRole(0),
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			input:      makeRole(-3),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeRole(2),
			setupMock: func(m *mockRoleRepo) {
				m.UpdateFn = func(_ *entity.Role) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật role thành công",
			input:     makeRole(5),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockRoleRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateRole(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockRoleRepo{
			UpdateFn: func(role *entity.Role) error {
				role.RoleName = "Admin"
				return nil
			},
		}
		role := makeRole(4)
		err := newTestUsecase(repo).UpdateRole(role)
		assertNoError(t, err)
		if role.RoleName != "Admin" {
			t.Errorf("expected RoleName = 'Admin', got %q", role.RoleName)
		}
	})
}

// ─── DeleteRole ───────────────────────────────────────────────────────────────

func TestDeleteRole(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockRoleRepo)
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
			id:         -1,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   3,
			setupMock: func(m *mockRoleRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá role thành công",
			id:        6,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockRoleRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteRole(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
