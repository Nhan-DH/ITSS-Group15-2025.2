package adapter

import "gym-management/internal/domain/entity"

type MembershipPackageRepository interface {
	Create(pkg *entity.MembershipPackage) error
	GetByID(id int) (*entity.MembershipPackage, error)
	GetAll() ([]*entity.MembershipPackage, error)
	GetAllPaginated(page, limit int) ([]*entity.MembershipPackage, int, error)
	Update(pkg *entity.MembershipPackage) error
	Delete(id int) error
}
