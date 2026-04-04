package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ServiceCategoryUsecase interface {
	CreateServiceCategory(serviceCategory *entity.ServiceCategory) error
	GetServiceCategoryByID(id int) (*entity.ServiceCategory, error)
	GetAllServiceCategories() ([]*entity.ServiceCategory, error)
	UpdateServiceCategory(serviceCategory *entity.ServiceCategory) error
	DeleteServiceCategory(id int) error
}

type serviceCategoryUsecase struct {
	repo adapter.ServiceCategoryRepository
}

func NewServiceCategoryUsecase(repo adapter.ServiceCategoryRepository) ServiceCategoryUsecase {
	return &serviceCategoryUsecase{repo: repo}
}

func (u *serviceCategoryUsecase) CreateServiceCategory(serviceCategory *entity.ServiceCategory) error {
	return u.repo.Create(serviceCategory)
}

func (u *serviceCategoryUsecase) GetServiceCategoryByID(id int) (*entity.ServiceCategory, error) {
	return u.repo.GetByID(id)
}

func (u *serviceCategoryUsecase) GetAllServiceCategories() ([]*entity.ServiceCategory, error) {
	return u.repo.GetAll()
}

func (u *serviceCategoryUsecase) UpdateServiceCategory(serviceCategory *entity.ServiceCategory) error {
	return u.repo.Update(serviceCategory)
}

func (u *serviceCategoryUsecase) DeleteServiceCategory(id int) error {
	return u.repo.Delete(id)
}
