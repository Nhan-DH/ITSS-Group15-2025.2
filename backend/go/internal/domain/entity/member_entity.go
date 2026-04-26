package entity

import "time"

type Member struct {
	ID           int       `json:"id"`
	FullName     string    `json:"full_name"`
	Phone        string    `json:"phone"`
	Email        string    `json:"email"`
	Gender       string    `json:"gender"`
	DOB          time.Time `json:"dob"`
	Address      string    `json:"address"`
	AccountID    int       `json:"account_id"`
	PackageName  string    `json:"package_name"`
	IsActive     bool      `json:"is_active"`
	RegisteredAt time.Time `json:"registered_at"`
}
