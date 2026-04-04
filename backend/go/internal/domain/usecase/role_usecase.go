package usecase

import "gym-management/internal/domain/entity"

type RoleUsecase interface {
	CreateRole(role *entity.Role) error
	GetRoleByID(id int) (*entity.Role, error)
	GetAllRoles() ([]*entity.Role, error)
	UpdateRole(role *entity.Role) error
	DeleteRole(id int) error
}
