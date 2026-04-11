package facility_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListFacilitysUseCase interface {
	Execute(ctx context.Context) ([]*entity.Facility, error)
}

type ListFacilitysUseCase struct {
	repo adapter.FacilityRepository
}

func NewListFacilitysUseCase(repo adapter.FacilityRepository) IListFacilitysUseCase {
	return &ListFacilitysUseCase{repo: repo}
}

func (u *ListFacilitysUseCase) Execute(ctx context.Context) ([]*entity.Facility, error) {
	return u.repo.GetAll()
}
