package domain

type Employee struct {
	ID        int     `json:"id"`
	FullName  string  `json:"full_name"`
	Phone     string  `json:"phone"`
	Position  string  `json:"position"`
	Salary    float64 `json:"salary"`
	AccountID int     `json:"account_id"`
}

type EmployeeRepository interface {
	Create(employee *Employee) error
	GetByID(id int) (*Employee, error)
	GetAll() ([]*Employee, error)
	Update(employee *Employee) error
	Delete(id int) error
}

type EmployeeUsecase interface {
	CreateEmployee(employee *Employee) error
	GetEmployeeByID(id int) (*Employee, error)
	GetAllEmployees() ([]*Employee, error)
	UpdateEmployee(employee *Employee) error
	DeleteEmployee(id int) error
}
