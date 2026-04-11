package facility_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListFacilitiesUseCase interface {
	Execute(ctx context.Context) ([]*entity.Facility, error)
}

type ListFacilitiesUseCase struct {
	repo adapter.FacilityRepository
}

func NewListFacilitiesUseCase(repo adapter.FacilityRepository) IListFacilitiesUseCase {
	return &ListFacilitiesUseCase{repo: repo}
}

func (u *ListFacilitiesUseCase) Execute(ctx context.Context) ([]*entity.Facility, error) {
	return u.repo.GetAll()
}
