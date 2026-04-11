package member_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListMembersUseCase interface {
	Execute(ctx context.Context) ([]*entity.Member, error)
}

type ListMembersUseCase struct {
	repo adapter.MemberRepository
}

func NewListMembersUseCase(repo adapter.MemberRepository) IListMembersUseCase {
	return &ListMembersUseCase{repo: repo}
}

func (u *ListMembersUseCase) Execute(ctx context.Context) ([]*entity.Member, error) {
	return u.repo.GetAll()
}
