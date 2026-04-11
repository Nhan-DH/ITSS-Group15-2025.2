package account_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateAccountUseCase interface {
	Execute(ctx context.Context, account *entity.Account) (*entity.Account, error)
}

type UpdateAccountUseCase struct {
	repo adapter.AccountRepository
}

func NewUpdateAccountUseCase(repo adapter.AccountRepository) IUpdateAccountUseCase {
	return &UpdateAccountUseCase{repo: repo}
}

func (u *UpdateAccountUseCase) Execute(ctx context.Context, account *entity.Account) (*entity.Account, error) {
	if account.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(account); err != nil {
		return nil, err
	}
	return account, nil
}
