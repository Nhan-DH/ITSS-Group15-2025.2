package auth_test

import (
	"context"
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/auth_usecase"
)

func TestChangePassword(t *testing.T) {
	ctx := context.Background()

	tests := []struct {
		name      string
		input     auth_usecase.ChangePasswordInput
		setupMock func(*mockAuthRepo)
		wantErrMsg string
		wantErrIs  error
		wantNoErr  bool
	}{
		{
			name: "accountID <= 0 trả về lỗi thiếu thông tin",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 0, OldPassword: "old123", NewPassword: "new123456",
			},
			wantErrMsg: "Vui lòng nhập đầy đủ thông tin",
		},
		{
			name: "old password rỗng trả về lỗi thiếu thông tin",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "", NewPassword: "new123456",
			},
			wantErrMsg: "Vui lòng nhập đầy đủ thông tin",
		},
		{
			name: "new password rỗng trả về lỗi thiếu thông tin",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "old123", NewPassword: "",
			},
			wantErrMsg: "Vui lòng nhập đầy đủ thông tin",
		},
		{
			name: "new password dưới 6 ký tự trả về lỗi",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "old123", NewPassword: "12345",
			},
			wantErrMsg: "Mật khẩu mới phải có ít nhất 6 ký tự",
		},
		{
			name: "new password đúng 6 ký tự được chấp nhận",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "old123", NewPassword: "123456",
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetAccountByIDFn = func(_ context.Context, _ int) (*entity.Account, error) {
					return makeAccount(1, "user", "old123", 1, false), nil
				}
			},
			wantNoErr: true,
		},
		{
			name: "tài khoản không tồn tại trả về ErrUnauthorized",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 99, OldPassword: "old123", NewPassword: "newpass1",
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetAccountByIDFn = func(_ context.Context, _ int) (*entity.Account, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrIs: auth_usecase.ErrUnauthorized,
		},
		{
			name: "mật khẩu cũ không đúng trả về lỗi",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "wrongold", NewPassword: "newpass1",
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetAccountByIDFn = func(_ context.Context, _ int) (*entity.Account, error) {
					return makeAccount(1, "user", "correctold", 1, false), nil
				}
			},
			wantErrMsg: "Mật khẩu cũ không đúng",
		},
		{
			name: "mật khẩu mới trùng mật khẩu cũ trả về lỗi",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "samepass1", NewPassword: "samepass1",
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetAccountByIDFn = func(_ context.Context, _ int) (*entity.Account, error) {
					return makeAccount(1, "user", "samepass1", 1, false), nil
				}
			},
			wantErrMsg: "Mật khẩu mới không được trùng mật khẩu cũ",
		},
		{
			name: "lỗi DB khi cập nhật mật khẩu trả về lỗi gốc",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "old123", NewPassword: "newpass1",
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetAccountByIDFn = func(_ context.Context, _ int) (*entity.Account, error) {
					return makeAccount(1, "user", "old123", 1, false), nil
				}
				m.UpdatePasswordFn = func(_ context.Context, _ int, _ string, _ bool) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name: "đổi mật khẩu thành công",
			input: auth_usecase.ChangePasswordInput{
				AccountID: 1, OldPassword: "old123", NewPassword: "newpass1",
			},
			setupMock: func(m *mockAuthRepo) {
				m.GetAccountByIDFn = func(_ context.Context, _ int) (*entity.Account, error) {
					return makeAccount(1, "user", "old123", 1, false), nil
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
			err := uc.ChangePassword(ctx, tt.input)

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
