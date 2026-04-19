package entity

type Facility struct {
	ID              int    `json:"id"`
	FacilityName    string `json:"facility_name"`
	FacilityType    string `json:"facility_type"`
	Status          string `json:"status"`
	MaxCapacity     int    `json:"max_capacity"`
	CurrentCapacity int    `json:"current_capacity"`
	Description     string `json:"description"`
}
