package usecase

import "gym-management/internal/domain/entity"

type MemberUsecase interface {
	CreateMember(member *entity.Member) error
	GetMemberByID(id int) (*entity.Member, error)
	GetAllMembers() ([]*entity.Member, error)
	UpdateMember(member *entity.Member) error
	DeleteMember(id int) error
}
