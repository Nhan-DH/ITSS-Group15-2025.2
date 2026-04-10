package entity

type Account struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	RoleID   int    `json:"role_id"`
}
