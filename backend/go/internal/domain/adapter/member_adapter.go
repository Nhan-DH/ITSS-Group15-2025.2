package adapter

import "gym-management/internal/domain/entity"

type MemberRepository interface {
	Create(member *entity.Member) error
	GetByID(id int) (*entity.Member, error)
	GetAll() ([]*entity.Member, error)
	Update(member *entity.Member) error
	Delete(id int) error
}
