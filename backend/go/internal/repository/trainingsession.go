package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type TrainingSessionRepository interface {
	Create(trainingSession *entity.TrainingSession) error
	GetByID(id int) (*entity.TrainingSession, error)
	GetAll() ([]*entity.TrainingSession, error)
	Update(trainingSession *entity.TrainingSession) error
	Delete(id int) error
}

type trainingSessionRepository struct {
	db *sql.DB
}

func NewTrainingSessionRepository(db *sql.DB) TrainingSessionRepository {
	return &trainingSessionRepository{db: db}
}

func (r *trainingSessionRepository) Create(trainingSession *entity.TrainingSession) error {
	query := `INSERT INTO "TrainingSession" (booking_id, facility_id, session_time, attendance_status, pt_feedback) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	return r.db.QueryRow(query, trainingSession.BookingID, trainingSession.FacilityID, trainingSession.SessionTime, trainingSession.AttendanceStatus, trainingSession.PTFeedback).Scan(&trainingSession.ID)
}

func (r *trainingSessionRepository) GetByID(id int) (*entity.TrainingSession, error) {
	query := `SELECT id, booking_id, facility_id, session_time, attendance_status, pt_feedback FROM "TrainingSession" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var trainingSession entity.TrainingSession
	err := row.Scan(&trainingSession.ID, &trainingSession.BookingID, &trainingSession.FacilityID, &trainingSession.SessionTime, &trainingSession.AttendanceStatus, &trainingSession.PTFeedback)
	if err != nil {
		return nil, err
	}

	return &trainingSession, nil
}

func (r *trainingSessionRepository) GetAll() ([]*entity.TrainingSession, error) {
	query := `SELECT id, booking_id, facility_id, session_time, attendance_status, pt_feedback FROM "TrainingSession"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trainingSessions []*entity.TrainingSession
	for rows.Next() {
		var trainingSession entity.TrainingSession
		err := rows.Scan(&trainingSession.ID, &trainingSession.BookingID, &trainingSession.FacilityID, &trainingSession.SessionTime, &trainingSession.AttendanceStatus, &trainingSession.PTFeedback)
		if err != nil {
			return nil, err
		}
		trainingSessions = append(trainingSessions, &trainingSession)
	}

	return trainingSessions, nil
}

func (r *trainingSessionRepository) Update(trainingSession *entity.TrainingSession) error {
	query := `UPDATE "TrainingSession" SET booking_id = $1, facility_id = $2, session_time = $3, attendance_status = $4, pt_feedback = $5 WHERE id = $6`
	_, err := r.db.Exec(query, trainingSession.BookingID, trainingSession.FacilityID, trainingSession.SessionTime, trainingSession.AttendanceStatus, trainingSession.PTFeedback, trainingSession.ID)
	return err
}

func (r *trainingSessionRepository) Delete(id int) error {
	query := `DELETE FROM "TrainingSession" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
