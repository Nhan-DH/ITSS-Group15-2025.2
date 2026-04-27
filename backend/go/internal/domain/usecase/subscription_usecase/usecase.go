package subscription_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type SubscriptionUsecase interface {
	CreateSubscription(subscription *entity.Subscription) error
	GetSubscriptionByID(id int) (*entity.Subscription, error)
	GetLatestSubscriptionByMemberID(memberID int) (*entity.Subscription, error)
	GetSubscriptionsByMemberID(memberID int) ([]*entity.Subscription, error)
	GetAllSubscriptions() ([]*entity.Subscription, error)
	UpdateSubscription(subscription *entity.Subscription) error
	DeleteSubscription(id int) error
}

type subscriptionUsecase struct {
	repo   adapter.SubscriptionRepository
	create ICreateSubscriptionUseCase
	get    IGetSubscriptionUseCase
	list   IListSubscriptionsUseCase
	update IUpdateSubscriptionUseCase
	delete IDeleteSubscriptionUseCase
}

func NewSubscriptionUsecase(repo adapter.SubscriptionRepository) SubscriptionUsecase {
	return &subscriptionUsecase{
		repo:   repo,
		create: NewCreateSubscriptionUseCase(repo),
		get:    NewGetSubscriptionUseCase(repo),
		list:   NewListSubscriptionsUseCase(repo),
		update: NewUpdateSubscriptionUseCase(repo),
		delete: NewDeleteSubscriptionUseCase(repo),
	}
}

func (u *subscriptionUsecase) CreateSubscription(subscription *entity.Subscription) error {
	created, err := u.create.Execute(context.Background(), subscription)
	if err != nil {
		return err
	}
	*subscription = *created
	return nil
}

func (u *subscriptionUsecase) GetSubscriptionByID(id int) (*entity.Subscription, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *subscriptionUsecase) GetLatestSubscriptionByMemberID(memberID int) (*entity.Subscription, error) {
	return u.repo.GetLatestByMemberID(memberID)
}

func (u *subscriptionUsecase) GetSubscriptionsByMemberID(memberID int) ([]*entity.Subscription, error) {
	return u.repo.GetByMemberID(memberID)
}

func (u *subscriptionUsecase) GetAllSubscriptions() ([]*entity.Subscription, error) {
	return u.list.Execute(context.Background())
}

func (u *subscriptionUsecase) UpdateSubscription(subscription *entity.Subscription) error {
	updated, err := u.update.Execute(context.Background(), subscription)
	if err != nil {
		return err
	}
	*subscription = *updated
	return nil
}

func (u *subscriptionUsecase) DeleteSubscription(id int) error {
	return u.delete.Execute(context.Background(), id)
}
