package account_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateAccount ────────────────────────────────────────────────────────────

func TestCreateAccount(t *testing.T) {
	t.Run("username rỗng trả về lỗi", func(t *testing.T) {
		repo := &mockAccountRepo{}
		acc := makeAccount(0, 1)
		acc.Username = ""
		err := newTestUsecase(repo).CreateAccount(acc)
		assertErrorMsg(t, err, "username cannot be empty")
	})

	t.Run("mật khẩu ngắn hơn 6 ký tự trả về lỗi", func(t *testing.T) {
		repo := &mockAccountRepo{}
		acc := makeAccount(0, 1)
		acc.Password = "abc"
		err := newTestUsecase(repo).CreateAccount(acc)
		assertErrorMsg(t, err, "password must be at least 6 characters")
	})

	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockAccountRepo{
			CreateFn: func(_ *entity.Account) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateAccount(makeAccount(0, 1))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo account thành công", func(t *testing.T) {
		repo := &mockAccountRepo{}
		err := newTestUsecase(repo).CreateAccount(makeAccount(0, 1))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, account pointer được cập nhật", func(t *testing.T) {
		repo := &mockAccountRepo{
			CreateFn: func(acc *entity.Account) error {
				acc.ID = 42
				return nil
			},
		}
		acc := makeAccount(0, 1)
		err := newTestUsecase(repo).CreateAccount(acc)
		assertNoError(t, err)
		if acc.ID != 42 {
			t.Errorf("expected acc.ID = 42 after create, got %d", acc.ID)
		}
	})
}

// ─── GetAccountByID ───────────────────────────────────────────────────────────

func TestGetAccountByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockAccountRepo)
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
			id:         -3,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockAccountRepo) {
				m.GetByIDFn = func(_ int) (*entity.Account, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy account thành công",
			id:   5,
			setupMock: func(m *mockAccountRepo) {
				m.GetByIDFn = func(id int) (*entity.Account, error) {
					return makeAccount(id, 2), nil
				}
			},
			wantID: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockAccountRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetAccountByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil account")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdateAccount ────────────────────────────────────────────────────────────

func TestUpdateAccount(t *testing.T) {
	t.Run("account nil trả về lỗi", func(t *testing.T) {
		repo := &mockAccountRepo{}
		err := newTestUsecase(repo).UpdateAccount(nil)
		assertErrorMsg(t, err, "account cannot be nil")
	})

	t.Run("ID = 0 trả về invalid id", func(t *testing.T) {
		repo := &mockAccountRepo{}
		err := newTestUsecase(repo).UpdateAccount(makeAccount(0, 1))
		assertErrorMsg(t, err, "invalid id")
	})

	t.Run("ID âm trả về invalid id", func(t *testing.T) {
		repo := &mockAccountRepo{}
		err := newTestUsecase(repo).UpdateAccount(makeAccount(-1, 1))
		assertErrorMsg(t, err, "invalid id")
	})

	t.Run("lỗi khi lấy existing account từ repo", func(t *testing.T) {
		repo := &mockAccountRepo{
			GetByIDFn: func(_ int) (*entity.Account, error) {
				return nil, errors.New("db not found")
			},
		}
		err := newTestUsecase(repo).UpdateAccount(makeAccount(5, 1))
		assertErrorMsg(t, err, "db not found")
	})

	t.Run("mật khẩu mới ngắn hơn 6 ký tự trả về lỗi", func(t *testing.T) {
		repo := &mockAccountRepo{
			GetByIDFn: func(_ int) (*entity.Account, error) {
				return makeAccount(5, 1), nil
			},
		}
		acc := makeAccount(5, 1)
		acc.Password = "abc"
		err := newTestUsecase(repo).UpdateAccount(acc)
		assertErrorMsg(t, err, "password must be at least 6 characters")
	})

	t.Run("lỗi repo.Update trả về lỗi gốc", func(t *testing.T) {
		repo := &mockAccountRepo{
			GetByIDFn: func(_ int) (*entity.Account, error) {
				return makeAccount(5, 1), nil
			},
			UpdateFn: func(_ *entity.Account) error {
				return errors.New("db update error")
			},
		}
		err := newTestUsecase(repo).UpdateAccount(makeAccount(5, 1))
		assertErrorMsg(t, err, "db update error")
	})

	t.Run("cập nhật account thành công", func(t *testing.T) {
		repo := &mockAccountRepo{
			GetByIDFn: func(_ int) (*entity.Account, error) {
				return makeAccount(3, 2), nil
			},
		}
		err := newTestUsecase(repo).UpdateAccount(makeAccount(3, 2))
		assertNoError(t, err)
	})

	t.Run("trường rỗng được điền từ existing account", func(t *testing.T) {
		existing := &entity.Account{ID: 7, Username: "existinguser", RoleID: 3, Password: "existingpass"}
		repo := &mockAccountRepo{
			GetByIDFn: func(_ int) (*entity.Account, error) {
				return existing, nil
			},
		}
		acc := &entity.Account{ID: 7, Username: "", Password: "", RoleID: 0}
		err := newTestUsecase(repo).UpdateAccount(acc)
		assertNoError(t, err)
		if acc.Username != "existinguser" {
			t.Errorf("expected Username = 'existinguser', got %q", acc.Username)
		}
		if acc.RoleID != 3 {
			t.Errorf("expected RoleID = 3, got %d", acc.RoleID)
		}
		if acc.Password != "existingpass" {
			t.Errorf("expected Password = 'existingpass', got %q", acc.Password)
		}
	})
}

// ─── DeleteAccount ────────────────────────────────────────────────────────────

func TestDeleteAccount(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockAccountRepo)
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
			id:   1,
			setupMock: func(m *mockAccountRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá account thành công",
			id:        9,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockAccountRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteAccount(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
