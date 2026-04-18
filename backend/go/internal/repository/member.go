package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type memberRepository struct {
	db *sql.DB
}

func NewMemberRepository(db *sql.DB) adapter.MemberRepository {
	return &memberRepository{db: db}
}

func (r *memberRepository) Create(member *entity.Member) error {
	query := `INSERT INTO "Member" (full_name, phone, email, gender, dob, address, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
	return r.db.QueryRow(query, member.FullName, member.Phone, member.Email, member.Gender, member.DOB, member.Address, member.AccountID).Scan(&member.ID)
}

func (r *memberRepository) GetByID(id int) (*entity.Member, error) {
	member := &entity.Member{}
	query := `SELECT id, full_name, phone, email, gender, dob, address, account_id FROM "Member" WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.AccountID)
	return member, err
}

func (r *memberRepository) GetAll() ([]*entity.Member, error) {
	rows, err := r.db.Query(`SELECT id, full_name, phone, email, gender, dob, address, account_id FROM "Member"`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var members []*entity.Member
	for rows.Next() {
		member := &entity.Member{}
		err := rows.Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.AccountID)
		if err != nil {
			return nil, err
		}
		members = append(members, member)
	}
	return members, nil
}

func (r *memberRepository) GetAllPaginated(page, limit int) ([]*entity.Member, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "Member"`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated data
	query := `SELECT id, full_name, phone, email, gender, dob, address, account_id FROM "Member" ORDER BY id LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var members []*entity.Member
	for rows.Next() {
		member := &entity.Member{}
		err := rows.Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.AccountID)
		if err != nil {
			return nil, 0, err
		}
		members = append(members, member)
	}
	return members, total, nil
}

func (r *memberRepository) Update(member *entity.Member) error {
	query := `UPDATE "Member" SET full_name = $1, phone = $2, email = $3, gender = $4, dob = $5, address = $6, account_id = $7 WHERE id = $8`
	_, err := r.db.Exec(query, member.FullName, member.Phone, member.Email, member.Gender, member.DOB, member.Address, member.AccountID, member.ID)
	return err
}

func (r *memberRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Member" WHERE id = $1`, id)
	return err
}
