package usecase

import "gym-management/internal/domain/entity"

type EquipmentUsecase interface {
	CreateEquipment(equipment *entity.Equipment) error
	GetEquipmentByID(id int) (*entity.Equipment, error)
	GetAllEquipments() ([]*entity.Equipment, error)
	UpdateEquipment(equipment *entity.Equipment) error
	DeleteEquipment(id int) error
}
