package member_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type MemberUsecase interface {
	CreateMember(member *entity.Member) error
	GetMemberByID(id int) (*entity.Member, error)
	GetAllMembers() ([]*entity.Member, error)
	UpdateMember(member *entity.Member) error
	DeleteMember(id int) error
}

type memberUsecase struct {
	create ICreateMemberUseCase
	get    IGetMemberUseCase
	list   IListMembersUseCase
	update IUpdateMemberUseCase
	delete IDeleteMemberUseCase
}

func NewMemberUsecase(repo adapter.MemberRepository) MemberUsecase {
	return &memberUsecase{
		create: NewCreateMemberUseCase(repo),
		get:    NewGetMemberUseCase(repo),
		list:   NewListMembersUseCase(repo),
		update: NewUpdateMemberUseCase(repo),
		delete: NewDeleteMemberUseCase(repo),
	}
}

func (u *memberUsecase) CreateMember(member *entity.Member) error {
	created, err := u.create.Execute(context.Background(), member)
	if err != nil {
		return err
	}
	*member = *created
	return nil
}

func (u *memberUsecase) GetMemberByID(id int) (*entity.Member, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *memberUsecase) GetAllMembers() ([]*entity.Member, error) {
	return u.list.Execute(context.Background())
}

func (u *memberUsecase) UpdateMember(member *entity.Member) error {
	updated, err := u.update.Execute(context.Background(), member)
	if err != nil {
		return err
	}
	*member = *updated
	return nil
}

func (u *memberUsecase) DeleteMember(id int) error {
	return u.delete.Execute(context.Background(), id)
}
