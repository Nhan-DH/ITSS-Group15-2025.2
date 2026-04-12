package auth_usecase

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"

	"golang.org/x/crypto/bcrypt"
)

func (u *authUsecase) Register(ctx context.Context, input RegisterInput) (*AuthResult, error) {
	username := strings.TrimSpace(input.Username)
	if username == "" || strings.TrimSpace(input.Password) == "" {
		return nil, ErrInvalidInput
	}
	if len(input.Password) < 6 {
		return nil, ErrInvalidInput
	}

	memberRoleID, err := u.repo.GetRoleIDByName(ctx, "MEMBER")
	if err != nil {
		return nil, err
	}

	_, err = u.repo.FindAccountByUsername(ctx, username)
	if err == nil {
		return nil, ErrConflict
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	account := &entity.Account{
		Username: username,
		Password: string(hashedPassword),
		RoleID:   memberRoleID,
	}
	if err := u.repo.CreateAccount(ctx, account); err != nil {
		return nil, err
	}

	roleName, err := u.repo.GetRoleNameByID(ctx, account.RoleID)
	if err != nil {
		return nil, err
	}

	authResult, refreshExpiry, err := u.generateAuthTokens(account.ID, account.Username, roleName)
	if err != nil {
		return nil, err
	}

	refreshHash, err := hashRefreshToken(authResult.RefreshToken)
	if err != nil {
		return nil, err
	}

	if err := u.repo.SaveRefreshToken(ctx, &adapter.RefreshTokenRecord{
		TokenHash: refreshHash,
		AccountID: account.ID,
		ExpiresAt: refreshExpiry,
	}); err != nil {
		return nil, err
	}

	return authResult, nil
}
