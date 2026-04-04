package entity

import "time"

type Equipment struct {
	ID                  int       `json:"id"`
	FacilityID          int       `json:"facility_id"`
	EquipmentName       string    `json:"equipment_name"`
	Origin              string    `json:"origin"`
	MaintenanceDeadline time.Time `json:"maintenance_deadline"`
	Status              string    `json:"status"`
}
