package adapter

import "gym-management/internal/domain/entity"

type EmployeeRepository interface {
	Create(employee *entity.Employee) error
	GetByID(id int) (*entity.Employee, error)
	GetAll() ([]*entity.Employee, error)
	Update(employee *entity.Employee) error
	Delete(id int) error
}
