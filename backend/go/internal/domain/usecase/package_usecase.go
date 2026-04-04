package usecase

import "gym-management/internal/domain/entity"

type MembershipPackageUsecase interface {
	CreatePackage(pkg *entity.MembershipPackage) error
	GetPackageByID(id int) (*entity.MembershipPackage, error)
	GetAllPackages() ([]*entity.MembershipPackage, error)
	UpdatePackage(pkg *entity.MembershipPackage) error
	DeletePackage(id int) error
}
