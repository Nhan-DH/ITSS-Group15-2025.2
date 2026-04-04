package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"
)

type packageUsecase struct {
	repo adapter.MembershipPackageRepository
}

func NewPackageUsecase(repo adapter.MembershipPackageRepository) usecase.MembershipPackageUsecase {
	return &packageUsecase{repo: repo}
}

func (u *packageUsecase) CreatePackage(pkg *entity.MembershipPackage) error {
	return u.repo.Create(pkg)
}

func (u *packageUsecase) GetPackageByID(id int) (*entity.MembershipPackage, error) {
	return u.repo.GetByID(id)
}

func (u *packageUsecase) GetAllPackages() ([]*entity.MembershipPackage, error) {
	return u.repo.GetAll()
}

func (u *packageUsecase) UpdatePackage(pkg *entity.MembershipPackage) error {
	return u.repo.Update(pkg)
}

func (u *packageUsecase) DeletePackage(id int) error {
	return u.repo.Delete(id)
}
