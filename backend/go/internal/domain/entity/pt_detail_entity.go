package entity

type PTDetail struct {
	EmployeeID          int    `json:"employee_id"`
	ProfessionalProfile string `json:"professional_profile"`
	BodyIndex           string `json:"body_index"`
	ExperienceYears     string `json:"experience_years"`
	Achievements        string `json:"achievements"`
	AvailableSchedule   string `json:"available_schedule"`
}
