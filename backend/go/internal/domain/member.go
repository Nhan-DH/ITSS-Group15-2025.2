package domain

import "time"

type Member struct {
	ID        int       `json:"id"`
	FullName  string    `json:"full_name"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	Gender    string    `json:"gender"`
	DOB       time.Time `json:"dob"`
	Address   string    `json:"address"`
	AccountID int       `json:"account_id"`
}

type MemberRepository interface {
	Create(member *Member) error
	GetByID(id int) (*Member, error)
	GetAll() ([]*Member, error)
	Update(member *Member) error
	Delete(id int) error
}

type MemberUsecase interface {
	CreateMember(member *Member) error
	GetMemberByID(id int) (*Member, error)
	GetAllMembers() ([]*Member, error)
	UpdateMember(member *Member) error
	DeleteMember(id int) error
}
