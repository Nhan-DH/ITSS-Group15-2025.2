package entity

type TrainingBooking struct {
	ID                int    `json:"id"`
	MemberID          int    `json:"member_id"`
	PTID              int    `json:"pt_id"`
	RequestedSchedule string `json:"requested_schedule"`
	TrainingPlanNote  string `json:"training_plan_note"`
	Status            string `json:"status"`
}
