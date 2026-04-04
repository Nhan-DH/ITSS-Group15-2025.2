package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type TrainingBookingRepository interface {
	Create(trainingBooking *entity.TrainingBooking) error
	GetByID(id int) (*entity.TrainingBooking, error)
	GetAll() ([]*entity.TrainingBooking, error)
	Update(trainingBooking *entity.TrainingBooking) error
	Delete(id int) error
}

type trainingBookingRepository struct {
	db *sql.DB
}

func NewTrainingBookingRepository(db *sql.DB) TrainingBookingRepository {
	return &trainingBookingRepository{db: db}
}

func (r *trainingBookingRepository) Create(trainingBooking *entity.TrainingBooking) error {
	query := `INSERT INTO "TrainingBooking" (member_id, pt_id, requested_schedule, training_plan_note, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	return r.db.QueryRow(query, trainingBooking.MemberID, trainingBooking.PTID, trainingBooking.RequestedSchedule, trainingBooking.TrainingPlanNote, trainingBooking.Status).Scan(&trainingBooking.ID)
}

func (r *trainingBookingRepository) GetByID(id int) (*entity.TrainingBooking, error) {
	query := `SELECT id, member_id, pt_id, requested_schedule, training_plan_note, status FROM "TrainingBooking" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var trainingBooking entity.TrainingBooking
	err := row.Scan(&trainingBooking.ID, &trainingBooking.MemberID, &trainingBooking.PTID, &trainingBooking.RequestedSchedule, &trainingBooking.TrainingPlanNote, &trainingBooking.Status)
	if err != nil {
		return nil, err
	}

	return &trainingBooking, nil
}

func (r *trainingBookingRepository) GetAll() ([]*entity.TrainingBooking, error) {
	query := `SELECT id, member_id, pt_id, requested_schedule, training_plan_note, status FROM "TrainingBooking"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trainingBookings []*entity.TrainingBooking
	for rows.Next() {
		var trainingBooking entity.TrainingBooking
		err := rows.Scan(&trainingBooking.ID, &trainingBooking.MemberID, &trainingBooking.PTID, &trainingBooking.RequestedSchedule, &trainingBooking.TrainingPlanNote, &trainingBooking.Status)
		if err != nil {
			return nil, err
		}
		trainingBookings = append(trainingBookings, &trainingBooking)
	}

	return trainingBookings, nil
}

func (r *trainingBookingRepository) Update(trainingBooking *entity.TrainingBooking) error {
	query := `UPDATE "TrainingBooking" SET member_id = $1, pt_id = $2, requested_schedule = $3, training_plan_note = $4, status = $5 WHERE id = $6`
	_, err := r.db.Exec(query, trainingBooking.MemberID, trainingBooking.PTID, trainingBooking.RequestedSchedule, trainingBooking.TrainingPlanNote, trainingBooking.Status, trainingBooking.ID)
	return err
}

func (r *trainingBookingRepository) Delete(id int) error {
	query := `DELETE FROM "TrainingBooking" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
