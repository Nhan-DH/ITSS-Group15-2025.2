package package_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type PackageUsecase interface {
	CreatePackage(membershipPackage *entity.MembershipPackage) error
	GetPackageByID(id int) (*entity.MembershipPackage, error)
	GetAllPackages() ([]*entity.MembershipPackage, error)
	UpdatePackage(membershipPackage *entity.MembershipPackage) error
	DeletePackage(id int) error
}

type membershipPackageUsecase struct {
	create ICreatePackageUseCase
	get    IGetPackageUseCase
	list   IListPackagesUseCase
	update IUpdatePackageUseCase
	delete IDeletePackageUseCase
}

func NewPackageUsecase(repo adapter.MembershipPackageRepository) PackageUsecase {
	return &membershipPackageUsecase{
		create: NewCreatePackageUseCase(repo),
		get:    NewGetPackageUseCase(repo),
		list:   NewListPackagesUseCase(repo),
		update: NewUpdatePackageUseCase(repo),
		delete: NewDeletePackageUseCase(repo),
	}
}

func (u *membershipPackageUsecase) CreatePackage(membershipPackage *entity.MembershipPackage) error {
	created, err := u.create.Execute(context.Background(), membershipPackage)
	if err != nil {
		return err
	}
	*membershipPackage = *created
	return nil
}

func (u *membershipPackageUsecase) GetPackageByID(id int) (*entity.MembershipPackage, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *membershipPackageUsecase) GetAllPackages() ([]*entity.MembershipPackage, error) {
	return u.list.Execute(context.Background())
}

func (u *membershipPackageUsecase) UpdatePackage(membershipPackage *entity.MembershipPackage) error {
	updated, err := u.update.Execute(context.Background(), membershipPackage)
	if err != nil {
		return err
	}
	*membershipPackage = *updated
	return nil
}

func (u *membershipPackageUsecase) DeletePackage(id int) error {
	return u.delete.Execute(context.Background(), id)
}
