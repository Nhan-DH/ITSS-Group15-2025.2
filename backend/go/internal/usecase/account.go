package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type AccountUsecase interface {
	CreateAccount(account *entity.Account) error
	GetAccountByID(id int) (*entity.Account, error)
	GetAllAccounts() ([]*entity.Account, error)
	UpdateAccount(account *entity.Account) error
	DeleteAccount(id int) error
}

type accountUsecase struct {
	repo adapter.AccountRepository
}

func NewAccountUsecase(repo adapter.AccountRepository) AccountUsecase {
	return &accountUsecase{repo: repo}
}

func (u *accountUsecase) CreateAccount(account *entity.Account) error {
	return u.repo.Create(account)
}

func (u *accountUsecase) GetAccountByID(id int) (*entity.Account, error) {
	return u.repo.GetByID(id)
}

func (u *accountUsecase) GetAllAccounts() ([]*entity.Account, error) {
	return u.repo.GetAll()
}

func (u *accountUsecase) UpdateAccount(account *entity.Account) error {
	return u.repo.Update(account)
}

func (u *accountUsecase) DeleteAccount(id int) error {
	return u.repo.Delete(id)
}
