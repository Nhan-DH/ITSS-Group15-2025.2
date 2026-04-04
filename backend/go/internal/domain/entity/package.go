package entity

type MembershipPackage struct {
	ID           int     `json:"id"`
	CategoryID   int     `json:"category_id"`
	PackageName  string  `json:"package_name"`
	DurationDays int     `json:"duration_days"`
	Price        float64 `json:"price"`
}
