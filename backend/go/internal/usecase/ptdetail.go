package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type PTDetailUsecase interface {
	CreatePTDetail(ptDetail *entity.PTDetail) error
	GetPTDetailByID(employeeID int) (*entity.PTDetail, error)
	GetAllPTDetails() ([]*entity.PTDetail, error)
	UpdatePTDetail(ptDetail *entity.PTDetail) error
	DeletePTDetail(employeeID int) error
}

type ptDetailUsecase struct {
	repo adapter.PTDetailRepository
}

func NewPTDetailUsecase(repo adapter.PTDetailRepository) PTDetailUsecase {
	return &ptDetailUsecase{repo: repo}
}

func (u *ptDetailUsecase) CreatePTDetail(ptDetail *entity.PTDetail) error {
	return u.repo.Create(ptDetail)
}

func (u *ptDetailUsecase) GetPTDetailByID(employeeID int) (*entity.PTDetail, error) {
	return u.repo.GetByID(employeeID)
}

func (u *ptDetailUsecase) GetAllPTDetails() ([]*entity.PTDetail, error) {
	return u.repo.GetAll()
}

func (u *ptDetailUsecase) UpdatePTDetail(ptDetail *entity.PTDetail) error {
	return u.repo.Update(ptDetail)
}

func (u *ptDetailUsecase) DeletePTDetail(employeeID int) error {
	return u.repo.Delete(employeeID)
}
