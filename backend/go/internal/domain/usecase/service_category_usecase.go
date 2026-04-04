package usecase

import "gym-management/internal/domain/entity"

type ServiceCategoryUsecase interface {
	CreateServiceCategory(sc *entity.ServiceCategory) error
	GetServiceCategoryByID(id int) (*entity.ServiceCategory, error)
	GetAllServiceCategories() ([]*entity.ServiceCategory, error)
	UpdateServiceCategory(sc *entity.ServiceCategory) error
	DeleteServiceCategory(id int) error
}
