package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type equipmentRepository struct {
	db *sql.DB
}

func NewEquipmentRepository(db *sql.DB) adapter.EquipmentRepository {
	return &equipmentRepository{db: db}
}

func (r *equipmentRepository) Create(equipment *entity.Equipment) error {
	var facilityID interface{} = equipment.FacilityID
	if equipment.FacilityID == 0 {
		facilityID = nil
	}
	query := `INSERT INTO "Equipment" (facility_id, equipment_name, serial_number, quantity, origin, purchase_date, maintenance_deadline, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	return r.db.QueryRow(query, facilityID, equipment.EquipmentName, equipment.SerialNumber, equipment.Quantity, equipment.Origin, equipment.PurchaseDate, equipment.MaintenanceDeadline, equipment.Status).Scan(&equipment.ID)
}

func (r *equipmentRepository) GetByID(id int) (*entity.Equipment, error) {
	equipment := &entity.Equipment{}
	query := `SELECT id, COALESCE(facility_id, 0), equipment_name, COALESCE(serial_number, ''), COALESCE(quantity, 1), COALESCE(origin, ''), COALESCE(purchase_date, CURRENT_DATE), COALESCE(maintenance_deadline, CURRENT_DATE), COALESCE(status, 'Operating') FROM "Equipment" WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(&equipment.ID, &equipment.FacilityID, &equipment.EquipmentName, &equipment.SerialNumber, &equipment.Quantity, &equipment.Origin, &equipment.PurchaseDate, &equipment.MaintenanceDeadline, &equipment.Status)
	return equipment, err
}

func (r *equipmentRepository) GetAll() ([]*entity.Equipment, error) {
	rows, err := r.db.Query(`SELECT id, COALESCE(facility_id, 0), equipment_name, COALESCE(serial_number, ''), COALESCE(quantity, 1), COALESCE(origin, ''), COALESCE(purchase_date, CURRENT_DATE), COALESCE(maintenance_deadline, CURRENT_DATE), COALESCE(status, 'Operating') FROM "Equipment"`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var equipments []*entity.Equipment
	for rows.Next() {
		equipment := &entity.Equipment{}
		err := rows.Scan(&equipment.ID, &equipment.FacilityID, &equipment.EquipmentName, &equipment.SerialNumber, &equipment.Quantity, &equipment.Origin, &equipment.PurchaseDate, &equipment.MaintenanceDeadline, &equipment.Status)
		if err != nil {
			return nil, err
		}
		equipments = append(equipments, equipment)
	}
	return equipments, nil
}

func (r *equipmentRepository) GetAllPaginated(page, limit int) ([]*entity.Equipment, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "Equipment"`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated data
	query := `SELECT id, COALESCE(facility_id, 0), equipment_name, COALESCE(serial_number, ''), COALESCE(quantity, 1), COALESCE(origin, ''), COALESCE(purchase_date, CURRENT_DATE), COALESCE(maintenance_deadline, CURRENT_DATE), COALESCE(status, 'Operating') FROM "Equipment" ORDER BY id LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var equipments []*entity.Equipment
	for rows.Next() {
		equipment := &entity.Equipment{}
		err := rows.Scan(&equipment.ID, &equipment.FacilityID, &equipment.EquipmentName, &equipment.SerialNumber, &equipment.Quantity, &equipment.Origin, &equipment.PurchaseDate, &equipment.MaintenanceDeadline, &equipment.Status)
		if err != nil {
			return nil, 0, err
		}
		equipments = append(equipments, equipment)
	}
	return equipments, total, nil
}

func (r *equipmentRepository) Update(equipment *entity.Equipment) error {
	var facilityID interface{} = equipment.FacilityID
	if equipment.FacilityID == 0 {
		facilityID = nil
	}
	query := `UPDATE "Equipment" SET facility_id = $1, equipment_name = $2, serial_number = $3, quantity = $4, origin = $5, purchase_date = $6, maintenance_deadline = $7, status = $8 WHERE id = $9`
	_, err := r.db.Exec(query, facilityID, equipment.EquipmentName, equipment.SerialNumber, equipment.Quantity, equipment.Origin, equipment.PurchaseDate, equipment.MaintenanceDeadline, equipment.Status, equipment.ID)
	return err
}

func (r *equipmentRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Equipment" WHERE id = $1`, id)
	return err
}
