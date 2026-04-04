package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"
)

type roleUsecase struct {
	repo adapter.RoleRepository
}

func NewRoleUsecase(repo adapter.RoleRepository) usecase.RoleUsecase {
	return &roleUsecase{repo: repo}
}

func (u *roleUsecase) CreateRole(role *entity.Role) error {
	return u.repo.Create(role)
}

func (u *roleUsecase) GetRoleByID(id int) (*entity.Role, error) {
	return u.repo.GetByID(id)
}

func (u *roleUsecase) GetAllRoles() ([]*entity.Role, error) {
	return u.repo.GetAll()
}

func (u *roleUsecase) UpdateRole(role *entity.Role) error {
	return u.repo.Update(role)
}

func (u *roleUsecase) DeleteRole(id int) error {
	return u.repo.Delete(id)
}
