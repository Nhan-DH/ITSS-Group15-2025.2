package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type PTDetailRepository interface {
	Create(ptDetail *entity.PTDetail) error
	GetByID(id int) (*entity.PTDetail, error)
	GetAll() ([]*entity.PTDetail, error)
	Update(ptDetail *entity.PTDetail) error
	Delete(id int) error
}

type ptDetailRepository struct {
	db *sql.DB
}

func NewPTDetailRepository(db *sql.DB) PTDetailRepository {
	return &ptDetailRepository{db: db}
}

func (r *ptDetailRepository) Create(ptDetail *entity.PTDetail) error {
	query := `INSERT INTO "PT_Detail" (employee_id, professional_profile, body_index, experience_years) VALUES ($1, $2, $3, $4)`
	_, err := r.db.Exec(query, ptDetail.EmployeeID, ptDetail.ProfessionalProfile, ptDetail.BodyIndex, ptDetail.ExperienceYears)
	return err
}

func (r *ptDetailRepository) GetByID(employeeID int) (*entity.PTDetail, error) {
	query := `SELECT employee_id, professional_profile, body_index, experience_years FROM "PT_Detail" WHERE employee_id = $1`
	row := r.db.QueryRow(query, employeeID)

	var ptDetail entity.PTDetail
	err := row.Scan(&ptDetail.EmployeeID, &ptDetail.ProfessionalProfile, &ptDetail.BodyIndex, &ptDetail.ExperienceYears)
	if err != nil {
		return nil, err
	}

	return &ptDetail, nil
}

func (r *ptDetailRepository) GetAll() ([]*entity.PTDetail, error) {
	query := `SELECT employee_id, professional_profile, body_index, experience_years FROM "PT_Detail"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ptDetails []*entity.PTDetail
	for rows.Next() {
		var ptDetail entity.PTDetail
		err := rows.Scan(&ptDetail.EmployeeID, &ptDetail.ProfessionalProfile, &ptDetail.BodyIndex, &ptDetail.ExperienceYears)
		if err != nil {
			return nil, err
		}
		ptDetails = append(ptDetails, &ptDetail)
	}

	return ptDetails, nil
}

func (r *ptDetailRepository) Update(ptDetail *entity.PTDetail) error {
	query := `UPDATE "PT_Detail" SET professional_profile = $1, body_index = $2, experience_years = $3 WHERE employee_id = $4`
	_, err := r.db.Exec(query, ptDetail.ProfessionalProfile, ptDetail.BodyIndex, ptDetail.ExperienceYears, ptDetail.EmployeeID)
	return err
}

func (r *ptDetailRepository) Delete(employeeID int) error {
	query := `DELETE FROM "PT_Detail" WHERE employee_id = $1`
	_, err := r.db.Exec(query, employeeID)
	return err
}
