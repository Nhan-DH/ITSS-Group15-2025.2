package domain

type MembershipPackage struct {
	ID           int     `json:"id"`
	CategoryID   int     `json:"category_id"`
	PackageName  string  `json:"package_name"`
	DurationDays int     `json:"duration_days"`
	Price        float64 `json:"price"`
}

type MembershipPackageRepository interface {
	Create(pkg *MembershipPackage) error
	GetByID(id int) (*MembershipPackage, error)
	GetAll() ([]*MembershipPackage, error)
	Update(pkg *MembershipPackage) error
	Delete(id int) error
}

type MembershipPackageUsecase interface {
	CreatePackage(pkg *MembershipPackage) error
	GetPackageByID(id int) (*MembershipPackage, error)
	GetAllPackages() ([]*MembershipPackage, error)
	UpdatePackage(pkg *MembershipPackage) error
	DeletePackage(id int) error
}
