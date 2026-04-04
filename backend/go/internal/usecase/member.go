package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"
)

type memberUsecase struct {
	repo adapter.MemberRepository
}

func NewMemberUsecase(repo adapter.MemberRepository) usecase.MemberUsecase {
	return &memberUsecase{repo: repo}
}

func (u *memberUsecase) CreateMember(member *entity.Member) error {
	return u.repo.Create(member)
}

func (u *memberUsecase) GetMemberByID(id int) (*entity.Member, error) {
	return u.repo.GetByID(id)
}

func (u *memberUsecase) GetAllMembers() ([]*entity.Member, error) {
	return u.repo.GetAll()
}

func (u *memberUsecase) UpdateMember(member *entity.Member) error {
	return u.repo.Update(member)
}

func (u *memberUsecase) DeleteMember(id int) error {
	return u.repo.Delete(id)
}
