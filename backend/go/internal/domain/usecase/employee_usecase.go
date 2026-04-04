package usecase

import "gym-management/internal/domain/entity"

type EmployeeUsecase interface {
	CreateEmployee(employee *entity.Employee) error
	GetEmployeeByID(id int) (*entity.Employee, error)
	GetAllEmployees() ([]*entity.Employee, error)
	UpdateEmployee(employee *entity.Employee) error
	DeleteEmployee(id int) error
}
