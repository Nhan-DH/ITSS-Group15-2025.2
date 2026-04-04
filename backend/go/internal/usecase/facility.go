package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"
)

type facilityUsecase struct {
	repo adapter.FacilityRepository
}

func NewFacilityUsecase(repo adapter.FacilityRepository) usecase.FacilityUsecase {
	return &facilityUsecase{repo: repo}
}

func (u *facilityUsecase) CreateFacility(facility *entity.Facility) error {
	return u.repo.Create(facility)
}

func (u *facilityUsecase) GetFacilityByID(id int) (*entity.Facility, error) {
	return u.repo.GetByID(id)
}

func (u *facilityUsecase) GetAllFacilities() ([]*entity.Facility, error) {
	return u.repo.GetAll()
}

func (u *facilityUsecase) UpdateFacility(facility *entity.Facility) error {
	return u.repo.Update(facility)
}

func (u *facilityUsecase) DeleteFacility(id int) error {
	return u.repo.Delete(id)
}
