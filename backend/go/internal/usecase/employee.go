package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"
)

type employeeUsecase struct {
	repo adapter.EmployeeRepository
}

func NewEmployeeUsecase(repo adapter.EmployeeRepository) usecase.EmployeeUsecase {
	return &employeeUsecase{repo: repo}
}

func (u *employeeUsecase) CreateEmployee(employee *entity.Employee) error {
	return u.repo.Create(employee)
}

func (u *employeeUsecase) GetEmployeeByID(id int) (*entity.Employee, error) {
	return u.repo.GetByID(id)
}

func (u *employeeUsecase) GetAllEmployees() ([]*entity.Employee, error) {
	return u.repo.GetAll()
}

func (u *employeeUsecase) UpdateEmployee(employee *entity.Employee) error {
	return u.repo.Update(employee)
}

func (u *employeeUsecase) DeleteEmployee(id int) error {
	return u.repo.Delete(id)
}
