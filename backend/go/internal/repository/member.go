package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/infra/api/dto"
)

type memberRepository struct {
	db *sql.DB
}

func NewMemberRepository(db *sql.DB) adapter.MemberRepository {
	return &memberRepository{db: db}
}

func (r *memberRepository) Create(member *entity.Member) error {
	var accountID interface{} = member.AccountID
	if member.AccountID == 0 {
		accountID = nil
	}
	query := `INSERT INTO "Member" (full_name, phone, email, gender, dob, address, account_id, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	return r.db.QueryRow(query, member.FullName, member.Phone, member.Email, member.Gender, member.DOB, member.Address, accountID, member.IsActive).Scan(&member.ID)
}

func (r *memberRepository) GetByID(id int) (*entity.Member, error) {
	member := &entity.Member{}
	query := `SELECT m.id, COALESCE(m.full_name, ''), COALESCE(m.phone, ''), COALESCE(m.email, ''), COALESCE(m.gender, ''), COALESCE(m.dob, CURRENT_DATE), COALESCE(m.address, ''), COALESCE(m.account_id, 0), COALESCE(m.is_active, true), COALESCE(p.package_name, ''), COALESCE(s.registration_date, CURRENT_DATE) 
	FROM "Member" m
	LEFT JOIN (
		SELECT DISTINCT ON (member_id) member_id, package_id, registration_date 
		FROM "Subscription" 
		ORDER BY member_id, id DESC
	) s ON m.id = s.member_id
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id
	WHERE m.id = $1`
	err := r.db.QueryRow(query, id).Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.AccountID, &member.IsActive, &member.PackageName, &member.RegisteredAt)
	return member, err
}

func (r *memberRepository) GetAll() ([]*entity.Member, error) {
	query := `SELECT m.id, COALESCE(m.full_name, ''), COALESCE(m.phone, ''), COALESCE(m.email, ''), COALESCE(m.gender, ''), COALESCE(m.dob, CURRENT_DATE), COALESCE(m.address, ''), COALESCE(m.account_id, 0), COALESCE(m.is_active, true), COALESCE(p.package_name, ''), COALESCE(s.registration_date, CURRENT_DATE) 
	FROM "Member" m
	LEFT JOIN (
		SELECT DISTINCT ON (member_id) member_id, package_id, registration_date 
		FROM "Subscription" 
		ORDER BY member_id, id DESC
	) s ON m.id = s.member_id
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var members []*entity.Member
	for rows.Next() {
		member := &entity.Member{}
		err := rows.Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.AccountID, &member.IsActive, &member.PackageName, &member.RegisteredAt)
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

	query := `SELECT m.id, COALESCE(m.full_name, ''), COALESCE(m.phone, ''), COALESCE(m.email, ''), COALESCE(m.gender, ''), COALESCE(m.dob, CURRENT_DATE), COALESCE(m.address, ''), COALESCE(m.account_id, 0), COALESCE(m.is_active, true), COALESCE(p.package_name, ''), COALESCE(s.registration_date, CURRENT_DATE) 
	FROM "Member" m
	LEFT JOIN (
		SELECT DISTINCT ON (member_id) member_id, package_id, registration_date 
		FROM "Subscription" 
		ORDER BY member_id, id DESC
	) s ON m.id = s.member_id
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id
	ORDER BY m.id DESC LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var members []*entity.Member
	for rows.Next() {
		member := &entity.Member{}
		err := rows.Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.AccountID, &member.IsActive, &member.PackageName, &member.RegisteredAt)
		if err != nil {
			return nil, 0, err
		}
		// Set default package name if not set
		if member.PackageName == "" {
			member.PackageName = "Chưa đăng ký"
		}
		members = append(members, member)
	}
	return members, total, nil
}

type memberScanner interface {
	Scan(dest ...interface{}) error
}

func scanMember(scanner memberScanner, member *entity.Member) error {
	var dob sql.NullTime
	if err := scanner.Scan(
		&member.ID,
		&member.FullName,
		&member.Phone,
		&member.Email,
		&member.Gender,
		&dob,
		&member.Address,
		&member.AccountID,
		&member.IsActive,
	); err != nil {
		return err
	}

	if dob.Valid {
		member.DOB = dob.Time
	}

	return nil
}

func (r *memberRepository) Update(member *entity.Member) error {
	var accountID interface{} = member.AccountID
	if member.AccountID == 0 {
		accountID = nil
	}
	query := `UPDATE "Member" SET full_name = $1, phone = $2, email = $3, gender = $4, dob = $5, address = $6, account_id = $7, is_active = $8 WHERE id = $9`
	_, err := r.db.Exec(query, member.FullName, member.Phone, member.Email, member.Gender, member.DOB, member.Address, accountID, member.IsActive, member.ID)
	return err
}

func (r *memberRepository) UpdateStatus(id int, isActive bool) error {
	query := `UPDATE "Member" SET is_active = $1 WHERE id = $2`
	_, err := r.db.Exec(query, isActive, id)
	return err
}

func (r *memberRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Member" WHERE id = $1`, id)
	return err
}

// GetAllMembersWithDetails - lấy danh sách members với thông tin đầy đủ từ các bảng join
func (r *memberRepository) GetAllMembersWithDetails() ([]*dto.MemberListItemDTO, error) {
	// SQL query join Member với Subscription và MembershipPackage
	// Tính sessionsRemaining = số ngày còn lại từ end_date - today
	query := `
	SELECT DISTINCT
		m.id,
		COALESCE(m.full_name, ''),
		COALESCE(m.phone, ''),
		COALESCE(mp.package_name, 'Chưa đăng ký') as package_name,
		CASE WHEN m.is_active = true THEN 'active' ELSE 'inactive' END as status,
		COALESCE(TO_CHAR(s.end_date, 'YYYY-MM-DD'), TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')) as end_date,
		COALESCE(TO_CHAR(s.start_date, 'YYYY-MM-DD'), TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')) as start_date,
		COALESCE((s.end_date::date - CURRENT_DATE), 0) as sessions_remaining
	FROM "Member" m
	LEFT JOIN "Subscription" s ON m.id = s.member_id AND s.status NOT IN ('Expired', 'Cancelled')
	LEFT JOIN "MembershipPackage" mp ON s.package_id = mp.id
	ORDER BY m.id DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []*dto.MemberListItemDTO
	for rows.Next() {
		var id int
		var fullName, phone, packageName, status, endDate, startDate string
		var sessionsRemaining int

		err := rows.Scan(&id, &fullName, &phone, &packageName, &status, &endDate, &startDate, &sessionsRemaining)
		if err != nil {
			return nil, err
		}

		member := &dto.MemberListItemDTO{
			ID:                id,
			Name:              fullName,
			Phone:             phone,
			Package:           packageName,
			Status:            status,
			ExpiryDate:        endDate,
			JoinDate:          startDate,
			SessionsRemaining: sessionsRemaining,
		}

		members = append(members, member)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return members, nil
}

// GetMemberByIDWithDetails - lấy chi tiết member theo ID
func (r *memberRepository) GetMemberByIDWithDetails(id int) (*dto.MemberDetailDTO, error) {
	memberDetail := &dto.MemberDetailDTO{}

	query := `
	SELECT DISTINCT
		m.id,
		COALESCE(m.full_name, ''),
		COALESCE(m.phone, ''),
		COALESCE(m.email, '') as email,
		COALESCE(m.gender, '') as gender,
		COALESCE(TO_CHAR(m.dob, 'YYYY-MM-DD'), '') as dob,
		COALESCE(m.address, '') as address,
		COALESCE(mp.package_name, 'Chưa đăng ký') as package_name,
		CASE WHEN m.is_active = true THEN 'active' ELSE 'inactive' END as status,
		COALESCE(TO_CHAR(s.end_date, 'YYYY-MM-DD'), '') as end_date,
		COALESCE(TO_CHAR(s.start_date, 'YYYY-MM-DD'), '') as start_date,
		COALESCE(m.is_active, true) as is_active
	FROM "Member" m
	LEFT JOIN "Subscription" s ON m.id = s.member_id AND s.status NOT IN ('Expired', 'Cancelled')
	LEFT JOIN "MembershipPackage" mp ON s.package_id = mp.id
	WHERE m.id = $1
	LIMIT 1
	`

	err := r.db.QueryRow(query, id).Scan(
		&memberDetail.ID,
		&memberDetail.FullName,
		&memberDetail.Phone,
		&memberDetail.Email,
		&memberDetail.Gender,
		&memberDetail.DOB,
		&memberDetail.Address,
		&memberDetail.Package,
		&memberDetail.Status,
		&memberDetail.ExpiryDate,
		&memberDetail.JoinDate,
		&memberDetail.IsActive,
	)

	return memberDetail, err
}
