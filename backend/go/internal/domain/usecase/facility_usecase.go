package usecase

import "gym-management/internal/domain/entity"

type FacilityUsecase interface {
	CreateFacility(facility *entity.Facility) error
	GetFacilityByID(id int) (*entity.Facility, error)
	GetAllFacilities() ([]*entity.Facility, error)
	UpdateFacility(facility *entity.Facility) error
	DeleteFacility(id int) error
}
