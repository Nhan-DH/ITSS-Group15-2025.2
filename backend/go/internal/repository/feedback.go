package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type feedbackRepository struct {
	db *sql.DB
}

func NewFeedbackRepository(db *sql.DB) adapter.FeedbackRepository {
	return &feedbackRepository{db: db}
}

func (r *feedbackRepository) Create(feedback *entity.Feedback) error {
	query := `INSERT INTO "Feedback" (member_id, processor_id, equipment_id, content, sent_at, resolution_note, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
	return r.db.QueryRow(query, feedback.MemberID, feedback.ProcessorID, feedback.EquipmentID, feedback.Content, feedback.SentAt, feedback.ResolutionNote, feedback.Status).Scan(&feedback.ID)
}

func (r *feedbackRepository) GetByID(id int) (*entity.Feedback, error) {
	feedback := &entity.Feedback{}
	query := `SELECT id, member_id, processor_id, equipment_id, content, sent_at, resolution_note, status FROM "Feedback" WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(&feedback.ID, &feedback.MemberID, &feedback.ProcessorID, &feedback.EquipmentID, &feedback.Content, &feedback.SentAt, &feedback.ResolutionNote, &feedback.Status)
	return feedback, err
}

func (r *feedbackRepository) GetAll() ([]*entity.Feedback, error) {
	rows, err := r.db.Query(`SELECT id, member_id, processor_id, equipment_id, content, sent_at, resolution_note, status FROM "Feedback"`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var feedbacks []*entity.Feedback
	for rows.Next() {
		feedback := &entity.Feedback{}
		err := rows.Scan(&feedback.ID, &feedback.MemberID, &feedback.ProcessorID, &feedback.EquipmentID, &feedback.Content, &feedback.SentAt, &feedback.ResolutionNote, &feedback.Status)
		if err != nil {
			return nil, err
		}
		feedbacks = append(feedbacks, feedback)
	}
	return feedbacks, nil
}

func (r *feedbackRepository) Update(feedback *entity.Feedback) error {
	query := `UPDATE "Feedback" SET member_id = $1, processor_id = $2, equipment_id = $3, content = $4, sent_at = $5, resolution_note = $6, status = $7 WHERE id = $8`
	_, err := r.db.Exec(query, feedback.MemberID, feedback.ProcessorID, feedback.EquipmentID, feedback.Content, feedback.SentAt, feedback.ResolutionNote, feedback.Status, feedback.ID)
	return err
}

func (r *feedbackRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Feedback" WHERE id = $1`, id)
	return err
}
