package service_category_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListServiceCategorysUseCase interface {
	Execute(ctx context.Context) ([]*entity.ServiceCategory, error)
}

type ListServiceCategorysUseCase struct {
	repo adapter.ServiceCategoryRepository
}

func NewListServiceCategorysUseCase(repo adapter.ServiceCategoryRepository) IListServiceCategorysUseCase {
	return &ListServiceCategorysUseCase{repo: repo}
}

func (u *ListServiceCategorysUseCase) Execute(ctx context.Context) ([]*entity.ServiceCategory, error) {
	return u.repo.GetAll()
}
