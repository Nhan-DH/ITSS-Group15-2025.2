package auth_test

import (
	"context"
	"time"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type mockAuthRepo struct {
	CreateAccountFn                     func(ctx context.Context, account *entity.Account) error
	FindAccountByUsernameFn             func(ctx context.Context, username string) (*entity.Account, error)
	GetAccountByIDFn                    func(ctx context.Context, id int) (*entity.Account, error)
	GetRoleNameByIDFn                   func(ctx context.Context, roleID int) (string, error)
	GetRoleIDByNameFn                   func(ctx context.Context, roleName string) (int, error)
	UpdatePasswordFn                    func(ctx context.Context, accountID int, newPassword string, isFirstLogin bool) error
	SaveRefreshTokenFn                  func(ctx context.Context, record *adapter.RefreshTokenRecord) error
	GetRefreshTokenFn                   func(ctx context.Context, tokenHash string) (*adapter.RefreshTokenRecord, error)
	RevokeRefreshTokenFn                func(ctx context.Context, tokenHash string) error
	RotateRefreshTokenFn                func(ctx context.Context, oldTokenHash string, newRecord *adapter.RefreshTokenRecord) error
	RevokeAllRefreshTokensByAccountIDFn func(ctx context.Context, accountID int) error
	SavePasswordResetTokenFn            func(ctx context.Context, accountID int, tokenHash string, expiresAt time.Time) error
	GetPasswordResetTokenFn             func(ctx context.Context, tokenHash string) (*adapter.PasswordResetRecord, error)
	MarkPasswordResetTokenUsedFn        func(ctx context.Context, tokenHash string) error
}

func (m *mockAuthRepo) CreateAccount(ctx context.Context, account *entity.Account) error {
	if m.CreateAccountFn != nil {
		return m.CreateAccountFn(ctx, account)
	}
	return nil
}

func (m *mockAuthRepo) FindAccountByUsername(ctx context.Context, username string) (*entity.Account, error) {
	if m.FindAccountByUsernameFn != nil {
		return m.FindAccountByUsernameFn(ctx, username)
	}
	return nil, nil
}

func (m *mockAuthRepo) GetAccountByID(ctx context.Context, id int) (*entity.Account, error) {
	if m.GetAccountByIDFn != nil {
		return m.GetAccountByIDFn(ctx, id)
	}
	return nil, nil
}

func (m *mockAuthRepo) GetRoleNameByID(ctx context.Context, roleID int) (string, error) {
	if m.GetRoleNameByIDFn != nil {
		return m.GetRoleNameByIDFn(ctx, roleID)
	}
	return "member", nil
}

func (m *mockAuthRepo) GetRoleIDByName(ctx context.Context, roleName string) (int, error) {
	if m.GetRoleIDByNameFn != nil {
		return m.GetRoleIDByNameFn(ctx, roleName)
	}
	return 0, nil
}

func (m *mockAuthRepo) UpdatePassword(ctx context.Context, accountID int, newPassword string, isFirstLogin bool) error {
	if m.UpdatePasswordFn != nil {
		return m.UpdatePasswordFn(ctx, accountID, newPassword, isFirstLogin)
	}
	return nil
}

func (m *mockAuthRepo) SaveRefreshToken(ctx context.Context, record *adapter.RefreshTokenRecord) error {
	if m.SaveRefreshTokenFn != nil {
		return m.SaveRefreshTokenFn(ctx, record)
	}
	return nil
}

func (m *mockAuthRepo) GetRefreshToken(ctx context.Context, tokenHash string) (*adapter.RefreshTokenRecord, error) {
	if m.GetRefreshTokenFn != nil {
		return m.GetRefreshTokenFn(ctx, tokenHash)
	}
	return nil, nil
}

func (m *mockAuthRepo) RevokeRefreshToken(ctx context.Context, tokenHash string) error {
	if m.RevokeRefreshTokenFn != nil {
		return m.RevokeRefreshTokenFn(ctx, tokenHash)
	}
	return nil
}

func (m *mockAuthRepo) RotateRefreshToken(ctx context.Context, oldTokenHash string, newRecord *adapter.RefreshTokenRecord) error {
	if m.RotateRefreshTokenFn != nil {
		return m.RotateRefreshTokenFn(ctx, oldTokenHash, newRecord)
	}
	return nil
}

func (m *mockAuthRepo) RevokeAllRefreshTokensByAccountID(ctx context.Context, accountID int) error {
	if m.RevokeAllRefreshTokensByAccountIDFn != nil {
		return m.RevokeAllRefreshTokensByAccountIDFn(ctx, accountID)
	}
	return nil
}

func (m *mockAuthRepo) SavePasswordResetToken(ctx context.Context, accountID int, tokenHash string, expiresAt time.Time) error {
	if m.SavePasswordResetTokenFn != nil {
		return m.SavePasswordResetTokenFn(ctx, accountID, tokenHash, expiresAt)
	}
	return nil
}

func (m *mockAuthRepo) GetPasswordResetToken(ctx context.Context, tokenHash string) (*adapter.PasswordResetRecord, error) {
	if m.GetPasswordResetTokenFn != nil {
		return m.GetPasswordResetTokenFn(ctx, tokenHash)
	}
	return nil, nil
}

func (m *mockAuthRepo) MarkPasswordResetTokenUsed(ctx context.Context, tokenHash string) error {
	if m.MarkPasswordResetTokenUsedFn != nil {
		return m.MarkPasswordResetTokenUsedFn(ctx, tokenHash)
	}
	return nil
}
