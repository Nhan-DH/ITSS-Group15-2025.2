package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type SubscriptionRepository interface {
	Create(subscription *entity.Subscription) error
	GetByID(id int) (*entity.Subscription, error)
	GetAll() ([]*entity.Subscription, error)
	Update(subscription *entity.Subscription) error
	Delete(id int) error
}

type subscriptionRepository struct {
	db *sql.DB
}

func NewSubscriptionRepository(db *sql.DB) SubscriptionRepository {
	return &subscriptionRepository{db: db}
}

func (r *subscriptionRepository) Create(subscription *entity.Subscription) error {
	query := `INSERT INTO "Subscription" (member_id, package_id, registration_date, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	return r.db.QueryRow(query, subscription.MemberID, subscription.PackageID, subscription.RegistrationDate, subscription.StartDate, subscription.EndDate, subscription.Status).Scan(&subscription.ID)
}

func (r *subscriptionRepository) GetByID(id int) (*entity.Subscription, error) {
	query := `SELECT id, member_id, package_id, registration_date, start_date, end_date, status FROM "Subscription" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var subscription entity.Subscription
	err := row.Scan(&subscription.ID, &subscription.MemberID, &subscription.PackageID, &subscription.RegistrationDate, &subscription.StartDate, &subscription.EndDate, &subscription.Status)
	if err != nil {
		return nil, err
	}

	return &subscription, nil
}

func (r *subscriptionRepository) GetAll() ([]*entity.Subscription, error) {
	query := `SELECT id, member_id, package_id, registration_date, start_date, end_date, status FROM "Subscription"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscriptions []*entity.Subscription
	for rows.Next() {
		var subscription entity.Subscription
		err := rows.Scan(&subscription.ID, &subscription.MemberID, &subscription.PackageID, &subscription.RegistrationDate, &subscription.StartDate, &subscription.EndDate, &subscription.Status)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, &subscription)
	}

	return subscriptions, nil
}

func (r *subscriptionRepository) Update(subscription *entity.Subscription) error {
	query := `UPDATE "Subscription" SET member_id = $1, package_id = $2, registration_date = $3, start_date = $4, end_date = $5, status = $6 WHERE id = $7`
	_, err := r.db.Exec(query, subscription.MemberID, subscription.PackageID, subscription.RegistrationDate, subscription.StartDate, subscription.EndDate, subscription.Status, subscription.ID)
	return err
}

func (r *subscriptionRepository) Delete(id int) error {
	query := `DELETE FROM "Subscription" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
