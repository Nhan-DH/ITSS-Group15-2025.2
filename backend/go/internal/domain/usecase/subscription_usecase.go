package usecase

import "gym-management/internal/domain/entity"

type SubscriptionUsecase interface {
	CreateSubscription(sub *entity.Subscription) error
	GetSubscriptionByID(id int) (*entity.Subscription, error)
	GetAllSubscriptions() ([]*entity.Subscription, error)
	UpdateSubscription(sub *entity.Subscription) error
	DeleteSubscription(id int) error
}
