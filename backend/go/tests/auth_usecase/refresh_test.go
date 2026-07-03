package auth_test

import (
	"context"
	"database/sql"
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/auth_usecase"
)

func TestRefresh(t *testing.T) {
	ctx := context.Background()

	// Token hợp lệ dùng chung cho nhiều test case
	validExpiry := time.Now().UTC().Add(7 * 24 * time.Hour)

	tests := []struct {
		name        string
		buildInput  func(t *testing.T) auth_usecase.RefreshInput
		setupMock   func(*mockAuthRepo)
		wantErrIs   error
		wantErrMsg  string
		wantSuccess bool
	}{
		{
			name: "refresh token rỗng trả về ErrInvalidInput",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				return auth_usecase.RefreshInput{RefreshToken: ""}
			},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name: "refresh token chỉ khoảng trắng trả về ErrInvalidInput",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				return auth_usecase.RefreshInput{RefreshToken: "   "}
			},
			wantErrIs: auth_usecase.ErrInvalidInput,
		},
		{
			name: "JWT không hợp lệ (chuỗi rác) trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				return auth_usecase.RefreshInput{RefreshToken: "not.a.valid.jwt"}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "JWT đã hết hạn trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				expiredTime := time.Now().UTC().Add(-2 * time.Hour)
				tok := makeRefreshToken(t, 1, "admin", "owner", expiredTime)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "token hợp lệ nhưng không có trong DB trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return nil, sql.ErrNoRows
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "lỗi DB khi lấy refresh token trả về lỗi gốc",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return nil, errors.New("db error")
				}
			},
			wantErrMsg: "db error",
		},
		{
			name: "accountID trong DB khác với JWT claims trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return makeTokenRecord(999, false, false), nil // accountID khác
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "token đã bị revoke trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return makeTokenRecord(1, true, false), nil // revoked = true
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "record trong DB đã hết hạn trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return makeTokenRecord(1, false, true), nil // expired = true
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "tài khoản không tồn tại khi cross-check trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return makeTokenRecord(1, false, false), nil
				}
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return nil, sql.ErrNoRows
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "accountID tài khoản khác với JWT claims khi cross-check trả về ErrUnauthorized",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return makeTokenRecord(1, false, false), nil
				}
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return makeAccount(999, "admin", "pass", 1, false), nil // ID không khớp
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "refresh thành công trả về AuthResult với token mới",
			buildInput: func(t *testing.T) auth_usecase.RefreshInput {
				tok := makeRefreshToken(t, 1, "admin", "owner", validExpiry)
				return auth_usecase.RefreshInput{RefreshToken: tok}
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetRefreshTokenFn = func(_ context.Context, _ string) (*adapter.RefreshTokenRecord, error) {
					return makeTokenRecord(1, false, false), nil
				}
				m.FindAccountByUsernameFn = func(_ context.Context, _ string) (*entity.Account, error) {
					return makeAccount(1, "admin", "pass", 1, false), nil
				}
				m.GetRoleNameByIDFn = func(_ context.Context, _ int) (string, error) {
					return "owner", nil
				}
			},
			wantSuccess: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockAuthRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			input := tt.buildInput(t)
			result, err := uc.Refresh(ctx, input)

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
				if result.RefreshToken == input.RefreshToken {
					t.Error("new RefreshToken should differ from old token (token rotation)")
				}
				if result.TokenType != "Bearer" {
					t.Errorf("TokenType: got %q, want %q", result.TokenType, "Bearer")
				}
			}
		})
	}
}
