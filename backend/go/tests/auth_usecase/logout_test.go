package auth_test

import (
	"context"
	"database/sql"
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/usecase/auth_usecase"
)

func TestLogout(t *testing.T) {
	ctx := context.Background()
	validToken := "valid-refresh-token-string"

	tests := []struct {
		name      string
		input     auth_usecase.LogoutInput
		setupMock func(*mockAuthRepo)
		wantErrIs error
		wantErrMsg string
		wantNoErr bool
	}{
		{
			name:      "refresh token rỗng trả về ErrInvalidInput",
			input:     auth_usecase.LogoutInput{RefreshToken: ""},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name:      "refresh token chỉ khoảng trắng trả về ErrInvalidInput",
			input:     auth_usecase.LogoutInput{RefreshToken: "   "},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name:  "có AccountID nhưng token không tồn tại trong DB trả về ErrUnauthorized",
			input: auth_usecase.LogoutInput{RefreshToken: validToken, AccountID: 1},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return nil, sql.ErrNoRows
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name:  "có AccountID nhưng lỗi DB khi lấy token trả về lỗi gốc",
			input: auth_usecase.LogoutInput{RefreshToken: validToken, AccountID: 1},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return nil, errors.New("db error")
				}
			},
			wantErrMsg: "db error",
		},
		{
			name:  "token thuộc tài khoản khác trả về ErrForbidden",
			input: auth_usecase.LogoutInput{RefreshToken: validToken, AccountID: 1},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return &adapter.RefreshTokenRecord{
						AccountID: 999,
						ExpiresAt: time.Now().UTC().Add(24 * time.Hour),
					}, nil
				}
			},
			wantErrIs: auth_usecase.ErrForbidden,
		},
		{
			name:  "lỗi khi revoke token trả về lỗi gốc",
			input: auth_usecase.LogoutInput{RefreshToken: validToken, AccountID: 0},
			setupMock: func(m *mockAuthRepo) {
				m.RevokeRefreshTokenFn = func(_ context.Context, _ string) error {
					return errors.New("revoke failed")
				}
			},
			wantErrMsg: "revoke failed",
		},
		{
			name:  "logout thành công không có AccountID (chỉ revoke)",
			input: auth_usecase.LogoutInput{RefreshToken: validToken, AccountID: 0},
			wantNoErr: true,
		},
		{
			name:  "logout thành công có AccountID hợp lệ",
			input: auth_usecase.LogoutInput{RefreshToken: validToken, AccountID: 5},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return &adapter.RefreshTokenRecord{
						AccountID: 5,
						ExpiresAt: time.Now().UTC().Add(24 * time.Hour),
					}, nil
				}
			},
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockAuthRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			err := uc.Logout(ctx, tt.input)

			switch {
			case tt.wantErrIs != nil:
				assertErrorIs(t, err, tt.wantErrIs)
			case tt.wantErrMsg != "":
				assertErrorMsg(t, err, tt.wantErrMsg)
			case tt.wantNoErr:
				assertNoError(t, err)
			}
		})
	}
}
