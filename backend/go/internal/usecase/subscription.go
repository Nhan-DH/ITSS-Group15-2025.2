package usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type SubscriptionUsecase interface {
	CreateSubscription(subscription *entity.Subscription) error
	GetSubscriptionByID(id int) (*entity.Subscription, error)
	GetAllSubscriptions() ([]*entity.Subscription, error)
	UpdateSubscription(subscription *entity.Subscription) error
	DeleteSubscription(id int) error
}

type subscriptionUsecase struct {
	repo adapter.SubscriptionRepository
}

func NewSubscriptionUsecase(repo adapter.SubscriptionRepository) SubscriptionUsecase {
	return &subscriptionUsecase{repo: repo}
}

func (u *subscriptionUsecase) CreateSubscription(subscription *entity.Subscription) error {
	return u.repo.Create(subscription)
}

func (u *subscriptionUsecase) GetSubscriptionByID(id int) (*entity.Subscription, error) {
	return u.repo.GetByID(id)
}

func (u *subscriptionUsecase) GetAllSubscriptions() ([]*entity.Subscription, error) {
	return u.repo.GetAll()
}

func (u *subscriptionUsecase) UpdateSubscription(subscription *entity.Subscription) error {
	return u.repo.Update(subscription)
}

func (u *subscriptionUsecase) DeleteSubscription(id int) error {
	return u.repo.Delete(id)
}
