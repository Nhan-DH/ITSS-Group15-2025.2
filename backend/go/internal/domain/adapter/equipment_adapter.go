package adapter

import "gym-management/internal/domain/entity"

type EquipmentRepository interface {
	Create(equipment *entity.Equipment) error
	GetByID(id int) (*entity.Equipment, error)
	GetAll() ([]*entity.Equipment, error)
	Update(equipment *entity.Equipment) error
	Delete(id int) error
}
