package auth_test

import (
	"context"
	"database/sql"
	"errors"
	"testing"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/auth_usecase"
)

func TestLogin(t *testing.T) {
	ctx := context.Background()

	tests := []struct {
		name           string
		input          auth_usecase.LoginInput
		setupMock      func(*mockAuthRepo)
		wantErrIs      error
		wantErrMsg     string
		wantSuccess    bool
		wantFirstLogin bool
		wantRole       string
	}{
		{
			name:      "username rỗng trả về ErrInvalidInput",
			input:     auth_usecase.LoginInput{Username: "", Password: "abc123"},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name:      "password rỗng trả về ErrInvalidInput",
			input:     auth_usecase.LoginInput{Username: "admin", Password: ""},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name:      "username chỉ khoảng trắng trả về ErrInvalidInput",
			input:     auth_usecase.LoginInput{Username: "   ", Password: "abc123"},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name:      "password chỉ khoảng trắng trả về ErrInvalidInput",
			input:     auth_usecase.LoginInput{Username: "admin", Password: "   "},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name:  "tài khoản không tồn tại trả về ErrInvalidCredentials",
			input: auth_usecase.LoginInput{Username: "nonexistent", Password: "abc123"},
			setupMock: func(m *mockAuthRepo) {
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return nil, sql.ErrNoRows
				}
			},
			wantErrIs: auth_usecase.ErrInvalidCredentials,
		},
		{
			name:  "lỗi database khi tìm tài khoản trả về lỗi gốc",
			input: auth_usecase.LoginInput{Username: "admin", Password: "abc123"},
			setupMock: func(m *mockAuthRepo) {
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return nil, errors.New("db connection error")
				}
			},
			wantErrMsg: "db connection error",
		},
		{
			name:  "sai mật khẩu trả về lỗi invalid password",
			input: auth_usecase.LoginInput{Username: "admin", Password: "wrongpass"},
			setupMock: func(m *mockAuthRepo) {
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return makeAccount(1, "admin", "correctpass", 1, false), nil
				}
			},
			wantErrMsg: "invalid password",
		},
		{
			name:  "lỗi khi lấy tên role trả về lỗi gốc",
			input: auth_usecase.LoginInput{Username: "admin", Password: "pass123"},
			setupMock: func(m *mockAuthRepo) {
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return makeAccount(1, "admin", "pass123", 99, false), nil
				}
				m.GetRoleNameByIDFn = func(_ context.Context, _ int) (string, error) {
					return "", errors.New("role not found")
				}
			},
			wantErrMsg: "role not found",
		},
		{
			name:  "lỗi khi lưu refresh token trả về lỗi gốc",
			input: auth_usecase.LoginInput{Username: "admin", Password: "pass123"},
			setupMock: func(m *mockAuthRepo) {
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return makeAccount(1, "admin", "pass123", 1, false), nil
				}
				m.GetRoleNameByIDFn = func(_ context.Context, _ int) (string, error) {
					return "owner", nil
				}
				m.SaveRefreshTokenFn = func(_ context.Context, _ *adapter.RefreshTokenRecord) error {
					return errors.New("db write error")
				}
			},
			wantErrMsg: "db write error",
		},
		{
			name:  "đăng nhập thành công trả về AuthResult đầy đủ",
			input: auth_usecase.LoginInput{Username: "admin", Password: "pass123"},
			setupMock: func(m *mockAuthRepo) {
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return makeAccount(1, "admin", "pass123", 1, false), nil
				}
				m.GetRoleNameByIDFn = func(_ context.Context, _ int) (string, error) {
					return "owner", nil
				}
			},
			wantSuccess:    true,
			wantFirstLogin: false,
			wantRole:       "owner",
		},
		{
			name:  "lần đầu đăng nhập IsFirstLogin = true",
			input: auth_usecase.LoginInput{Username: "newstaff", Password: "pass123"},
			setupMock: func(m *mockAuthRepo) {
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return makeAccount(2, "newstaff", "pass123", 2, true), nil
				}
				m.GetRoleNameByIDFn = func(_ context.Context, _ int) (string, error) {
					return "staff", nil
				}
			},
			wantSuccess:    true,
			wantFirstLogin: true,
			wantRole:       "staff",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockAuthRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			result, err := uc.Login(ctx, tt.input)

			switch {
			case tt.wantErrIs != nil:
				assertErrorIs(t, err, tt.wantErrIs)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}

			case tt.wantErrMsg != "":
				assertErrorMsg(t, err, tt.wantErrMsg)

			case tt.wantSuccess:
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil AuthResult")
				}
				if result.AccessToken == "" {
					t.Error("AccessToken should not be empty")
				}
				if result.RefreshToken == "" {
					t.Error("RefreshToken should not be empty")
				}
				if result.TokenType != "Bearer" {
					t.Errorf("TokenType: got %q, want %q", result.TokenType, "Bearer")
				}
				if result.IsFirstLogin != tt.wantFirstLogin {
					t.Errorf("IsFirstLogin: got %v, want %v", result.IsFirstLogin, tt.wantFirstLogin)
				}
				if result.Role != tt.wantRole {
					t.Errorf("Role: got %q, want %q", result.Role, tt.wantRole)
				}
			}
		})
	}
}
