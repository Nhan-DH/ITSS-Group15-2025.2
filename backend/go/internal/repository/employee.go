package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type employeeRepository struct {
	db *sql.DB
}

func NewEmployeeRepository(db *sql.DB) adapter.EmployeeRepository {
	return &employeeRepository{db: db}
}

func (r *employeeRepository) Create(employee *entity.Employee) error {
	query := `INSERT INTO "Employee" (full_name, phone, position, salary, account_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	return r.db.QueryRow(query, employee.FullName, employee.Phone, employee.Position, employee.Salary, employee.AccountID).Scan(&employee.ID)
}

func (r *employeeRepository) GetByID(id int) (*entity.Employee, error) {
	employee := &entity.Employee{}
	query := `SELECT id, full_name, phone, position, salary, account_id FROM "Employee" WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(&employee.ID, &employee.FullName, &employee.Phone, &employee.Position, &employee.Salary, &employee.AccountID)
	return employee, err
}

func (r *employeeRepository) GetAll() ([]*entity.Employee, error) {
	rows, err := r.db.Query(`SELECT id, full_name, phone, position, salary, account_id FROM "Employee"`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var employees []*entity.Employee
	for rows.Next() {
		employee := &entity.Employee{}
		err := rows.Scan(&employee.ID, &employee.FullName, &employee.Phone, &employee.Position, &employee.Salary, &employee.AccountID)
		if err != nil {
			return nil, err
		}
		employees = append(employees, employee)
	}
	return employees, nil
}

func (r *employeeRepository) GetAllPaginated(page, limit int) ([]*entity.Employee, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "Employee"`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated data
	query := `SELECT id, full_name, phone, position, salary, account_id FROM "Employee" ORDER BY id LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var employees []*entity.Employee
	for rows.Next() {
		employee := &entity.Employee{}
		err := rows.Scan(&employee.ID, &employee.FullName, &employee.Phone, &employee.Position, &employee.Salary, &employee.AccountID)
		if err != nil {
			return nil, 0, err
		}
		employees = append(employees, employee)
	}
	return employees, total, nil
}

func (r *employeeRepository) Update(employee *entity.Employee) error {
	query := `UPDATE "Employee" SET full_name = $1, phone = $2, position = $3, salary = $4, account_id = $5 WHERE id = $6`
	_, err := r.db.Exec(query, employee.FullName, employee.Phone, employee.Position, employee.Salary, employee.AccountID, employee.ID)
	return err
}

func (r *employeeRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Employee" WHERE id = $1`, id)
	return err
}
