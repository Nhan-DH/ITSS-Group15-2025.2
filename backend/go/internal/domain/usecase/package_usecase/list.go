package package_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListPackagesUseCase interface {
	Execute(ctx context.Context) ([]*entity.MembershipPackage, error)
}

type ListPackagesUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewListPackagesUseCase(repo adapter.MembershipPackageRepository) IListPackagesUseCase {
	return &ListPackagesUseCase{repo: repo}
}

func (u *ListPackagesUseCase) Execute(ctx context.Context) ([]*entity.MembershipPackage, error) {
	return u.repo.GetAll()
}
