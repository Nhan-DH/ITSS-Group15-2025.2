package dto

// UpdateMyMemberProfileRequest supports partial updates for the authenticated member profile.
type UpdateMyMemberProfileRequest struct {
	FullName *string `json:"full_name"`
	Phone    *string `json:"phone"`
	Email    *string `json:"email"`
	Gender   *string `json:"gender"`
	DOB      *string `json:"dob"`
	Address  *string `json:"address"`
}

type RegisterMyPackageRequest struct {
	PackageID int `json:"package_id"`
}

type RenewMyPackageRequest struct {
	SubscriptionID int `json:"subscription_id,omitempty"`
	RenewalMonths  int `json:"renewal_months"`
}

type MyPackageResponse struct {
	ID             int     `json:"id"`
	PackageID      int     `json:"packageId"`
	Name           string  `json:"name"`
	Price          float64 `json:"price"`
	DurationDays   int     `json:"durationDays"`
	Status         string  `json:"status"`
	RegisteredDate string  `json:"registeredDate"`
	StartDate      string  `json:"startDate"`
	EndDate        string  `json:"endDate"`
}

type RenewMyPackageResponse struct {
	SubscriptionID int    `json:"subscription_id"`
	PackageID      int    `json:"package_id"`
	PackageName    string `json:"package_name"`
	RenewalMonths  int    `json:"renewal_months"`
	OldEndDate     string `json:"old_end_date"`
	NewEndDate     string `json:"new_end_date"`
	Status         string `json:"status"`
}

// --- Training History ---

type MyTrainingHistoryItemResponse struct {
	SessionID         int    `json:"session_id"`
	BookingID         int    `json:"booking_id"`
	PTID              int    `json:"pt_id"`
	FacilityID        int    `json:"facility_id"`
	SessionTime       string `json:"session_time"`
	AttendanceStatus  string `json:"attendance_status"`
	PTFeedback        string `json:"pt_feedback"`
	RequestedSchedule string `json:"requested_schedule,omitempty"`
	BookingStatus     string `json:"booking_status,omitempty"`
}

// --- Schedule ---

type MyScheduleSessionItemResponse struct {
	SessionID         int    `json:"session_id"`
	BookingID         int    `json:"booking_id"`
	PTID              int    `json:"pt_id"`
	FacilityID        int    `json:"facility_id"`
	SessionTime       string `json:"session_time"`
	AttendanceStatus  string `json:"attendance_status"`
	RequestedSchedule string `json:"requested_schedule,omitempty"`
	BookingStatus     string `json:"booking_status,omitempty"`
}

type MyScheduleBookingItemResponse struct {
	BookingID         int    `json:"booking_id"`
	PTID              int    `json:"pt_id"`
	RequestedSchedule string `json:"requested_schedule"`
	BookingStatus     string `json:"booking_status"`
	TrainingPlanNote  string `json:"training_plan_note,omitempty"`
}

type MyScheduleResponse struct {
	UpcomingSessions []*MyScheduleSessionItemResponse `json:"upcoming_sessions"`
	BookingRequests  []*MyScheduleBookingItemResponse `json:"booking_requests"`
}

// --- Feedbacks ---

type MyFeedbackItemResponse struct {
	ID             int     `json:"id"`
	MemberID       int     `json:"member_id"`
	ProcessorID    int     `json:"processor_id"`
	EquipmentID    int     `json:"equipment_id"`
	Content        string  `json:"content"`
	SentAt         string  `json:"sent_at"`
	ResolutionNote string  `json:"resolution_note"`
	Status         string  `json:"status"`
	Rating         float64 `json:"rating"`
	FeedbackType   string  `json:"feedback_type"`
}

// UpdateFeedbackStatusRequest dùng cho PATCH /feedbacks/{id}/status.
type UpdateFeedbackStatusRequest struct {
	Status       string `json:"status"`
	ResponseText string `json:"responseText"`
}
