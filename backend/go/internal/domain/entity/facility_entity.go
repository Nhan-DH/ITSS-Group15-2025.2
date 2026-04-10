package entity

type Facility struct {
	ID           int    `json:"id"`
	FacilityName string `json:"facility_name"`
	FacilityType string `json:"facility_type"`
	Status       string `json:"status"`
}
