package usecase

import "gym-management/internal/domain/entity"

type AccountUsecase interface {
	CreateAccount(account *entity.Account) error
	GetAccountByID(id int) (*entity.Account, error)
	GetAllAccounts() ([]*entity.Account, error)
	UpdateAccount(account *entity.Account) error
	DeleteAccount(id int) error
}
