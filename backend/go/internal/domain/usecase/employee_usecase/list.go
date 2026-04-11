package employee_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListEmployeesUseCase interface {
	Execute(ctx context.Context) ([]*entity.Employee, error)
}

type ListEmployeesUseCase struct {
	repo adapter.EmployeeRepository
}

func NewListEmployeesUseCase(repo adapter.EmployeeRepository) IListEmployeesUseCase {
	return &ListEmployeesUseCase{repo: repo}
}

func (u *ListEmployeesUseCase) Execute(ctx context.Context) ([]*entity.Employee, error) {
	return u.repo.GetAll()
}
