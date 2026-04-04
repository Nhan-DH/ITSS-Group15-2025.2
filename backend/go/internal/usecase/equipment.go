package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"
)

type equipmentUsecase struct {
	repo adapter.EquipmentRepository
}

func NewEquipmentUsecase(repo adapter.EquipmentRepository) usecase.EquipmentUsecase {
	return &equipmentUsecase{repo: repo}
}

func (u *equipmentUsecase) CreateEquipment(equipment *entity.Equipment) error {
	return u.repo.Create(equipment)
}

func (u *equipmentUsecase) GetEquipmentByID(id int) (*entity.Equipment, error) {
	return u.repo.GetByID(id)
}

func (u *equipmentUsecase) GetAllEquipments() ([]*entity.Equipment, error) {
	return u.repo.GetAll()
}

func (u *equipmentUsecase) UpdateEquipment(equipment *entity.Equipment) error {
	return u.repo.Update(equipment)
}

func (u *equipmentUsecase) DeleteEquipment(id int) error {
	return u.repo.Delete(id)
}
