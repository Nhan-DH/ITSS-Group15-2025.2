package domain

import "time"

type Equipment struct {
	ID                  int       `json:"id"`
	FacilityID          int       `json:"facility_id"`
	EquipmentName       string    `json:"equipment_name"`
	Origin              string    `json:"origin"`
	MaintenanceDeadline time.Time `json:"maintenance_deadline"`
	Status              string    `json:"status"`
}

type EquipmentRepository interface {
	Create(equipment *Equipment) error
	GetByID(id int) (*Equipment, error)
	GetAll() ([]*Equipment, error)
	Update(equipment *Equipment) error
	Delete(id int) error
}

type EquipmentUsecase interface {
	CreateEquipment(equipment *Equipment) error
	GetEquipmentByID(id int) (*Equipment, error)
	GetAllEquipments() ([]*Equipment, error)
	UpdateEquipment(equipment *Equipment) error
	DeleteEquipment(id int) error
}
