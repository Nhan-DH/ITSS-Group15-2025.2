package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/feedback_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/package_usecase"
	"gym-management/internal/domain/usecase/subscription_usecase"
	"gym-management/internal/domain/usecase/training_booking_usecase"
	"gym-management/internal/domain/usecase/training_session_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type MemberHandler struct {
	usecase             member_usecase.MemberUsecase
	packageUsecase      package_usecase.PackageUsecase
	subscriptionUsecase subscription_usecase.SubscriptionUsecase
	feedbackUsecase     feedback_usecase.FeedbackUsecase
	bookingUsecase      training_booking_usecase.TrainingBookingUsecase
	sessionUsecase      training_session_usecase.TrainingSessionUsecase
}

func NewMemberHandler(
	u member_usecase.MemberUsecase,
	packageUsecase package_usecase.PackageUsecase,
	subscriptionUsecase subscription_usecase.SubscriptionUsecase,
	feedbackUsecase feedback_usecase.FeedbackUsecase,
	bookingUsecase training_booking_usecase.TrainingBookingUsecase,
	sessionUsecase training_session_usecase.TrainingSessionUsecase,
) *MemberHandler {
	return &MemberHandler{
		usecase:             u,
		packageUsecase:      packageUsecase,
		subscriptionUsecase: subscriptionUsecase,
		feedbackUsecase:     feedbackUsecase,
		bookingUsecase:      bookingUsecase,
		sessionUsecase:      sessionUsecase,
	}
}

func (h *MemberHandler) Create(w http.ResponseWriter, r *http.Request) {
	var member entity.Member
	json.NewDecoder(r.Body).Decode(&member)
	err := h.usecase.CreateMember(&member)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(member)
}

func (h *MemberHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	if user, ok := middleware.GetAuthenticatedUser(r); ok && strings.EqualFold(strings.TrimSpace(user.Role), "MEMBER") {
		currentMember, err := h.usecase.GetMemberByAccountID(user.AccountID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		if currentMember.ID != id {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
	}

	// Try to get member with details first
	memberDetail, err := h.usecase.GetMemberByIDWithDetails(id)
	if err == nil && memberDetail != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(memberDetail)
		return
	}

	// Fallback to basic member data
	member, err := h.usecase.GetMemberByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(member)
}

func (h *MemberHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Check for pagination parameters
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	// Try to get members with details
	membersDetail, err := h.usecase.GetAllMembersWithDetails()
	if err == nil && membersDetail != nil {
		// Apply pagination if requested
		if pageStr != "" && limitStr != "" {
			page, errPage := strconv.Atoi(pageStr)
			if errPage != nil || page < 1 {
				page = 1
			}
			limit, errLimit := strconv.Atoi(limitStr)
			if errLimit != nil || limit < 1 {
				limit = 10
			}

			totalItems := len(membersDetail)
			totalPages := (totalItems + limit - 1) / limit
			startIdx := (page - 1) * limit
			endIdx := startIdx + limit

			if startIdx >= totalItems {
				startIdx = 0
				endIdx = 0
			} else if endIdx > totalItems {
				endIdx = totalItems
			}

			var paginatedData []*dto.MemberListItemDTO
			if endIdx > startIdx {
				paginatedData = membersDetail[startIdx:endIdx]
			}

			response := dto.PaginationResponse{
				Data:       paginatedData,
				Page:       page,
				Limit:      limit,
				TotalItems: totalItems,
				TotalPages: totalPages,
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}

		// Return all data without pagination
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(membersDetail)
		return
	}

	// Fallback to basic member list with pagination
	if pageStr != "" && limitStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 {
			limit = 6
		}

		members, total, err := h.usecase.GetAllMembersPaginated(page, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       members,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	members, err := h.usecase.GetAllMembers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(members)
}

func (h *MemberHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil || id <= 0 {
		http.Error(w, "invalid member id", http.StatusBadRequest)
		return
	}

	var member entity.Member
	if err := json.NewDecoder(r.Body).Decode(&member); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	member.ID = id

	if member.AccountID == 0 {
		existing, getErr := h.usecase.GetMemberByID(id)
		if getErr != nil {
			http.Error(w, getErr.Error(), http.StatusNotFound)
			return
		}
		member.AccountID = existing.AccountID
	}

	err = h.usecase.UpdateMember(&member)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *MemberHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	detail, err := h.usecase.GetMemberByIDWithDetails(member.ID)
	if err == nil && detail != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(detail)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(member)
}

func (h *MemberHandler) UpdateMe(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	var req dto.UpdateMyMemberProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.FullName != nil {
		member.FullName = strings.TrimSpace(*req.FullName)
	}
	if req.Phone != nil {
		member.Phone = strings.TrimSpace(*req.Phone)
	}
	if req.Email != nil {
		member.Email = strings.TrimSpace(*req.Email)
	}
	if req.Gender != nil {
		member.Gender = strings.TrimSpace(*req.Gender)
	}
	if req.Address != nil {
		member.Address = strings.TrimSpace(*req.Address)
	}
	if req.DOB != nil {
		dobRaw := strings.TrimSpace(*req.DOB)
		if dobRaw != "" {
			dob, err := time.Parse("2006-01-02", dobRaw)
			if err != nil {
				http.Error(w, "invalid dob format, expected YYYY-MM-DD", http.StatusBadRequest)
				return
			}
			member.DOB = dob
		}
	}

	// Giữ nguyên is_active từ bản ghi hiện tại (không để zero-value ghi đè)
	// member.IsActive đã được load từ resolveCurrentMember → GetMemberByAccountID
	// Không cần làm gì thêm, member đã có đầy đủ thông tin cần thiết

	if err := h.usecase.UpdateMember(member); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	detail, err := h.usecase.GetMemberByIDWithDetails(member.ID)
	if err == nil && detail != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(detail)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(member)
}


func (h *MemberHandler) GetMyPackages(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	subscriptions, err := h.subscriptionUsecase.GetSubscriptionsByMemberID(member.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	todayStart := time.Now().Truncate(24 * time.Hour)
	responses := make([]*dto.MyPackageResponse, 0, len(subscriptions))
	for _, sub := range subscriptions {
		pkg, err := h.packageUsecase.GetPackageByID(sub.PackageID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		responses = append(responses, mapSubscriptionToMyPackageResponse(sub, pkg, todayStart))
	}

	sort.SliceStable(responses, func(i, j int) bool {
		iActive := responses[i].Status == "active"
		jActive := responses[j].Status == "active"
		if iActive != jActive {
			return iActive
		}

		iEnd, iErr := time.Parse(time.RFC3339, responses[i].EndDate)
		jEnd, jErr := time.Parse(time.RFC3339, responses[j].EndDate)
		if iErr == nil && jErr == nil && !iEnd.Equal(jEnd) {
			return iEnd.After(jEnd)
		}

		iStart, iErr := time.Parse(time.RFC3339, responses[i].StartDate)
		jStart, jErr := time.Parse(time.RFC3339, responses[j].StartDate)
		if iErr == nil && jErr == nil && !iStart.Equal(jStart) {
			return iStart.After(jStart)
		}

		return responses[i].ID > responses[j].ID
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)
}

func (h *MemberHandler) RegisterMyPackage(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	var req dto.RegisterMyPackageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.PackageID <= 0 {
		http.Error(w, "package_id is required", http.StatusBadRequest)
		return
	}

	pkg, err := h.packageUsecase.GetPackageByID(req.PackageID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if !pkg.IsActive {
		http.Error(w, "package is not active", http.StatusBadRequest)
		return
	}
	if pkg.DurationDays <= 0 {
		http.Error(w, "invalid package duration", http.StatusBadRequest)
		return
	}

	latest, err := h.subscriptionUsecase.GetLatestSubscriptionByMemberID(member.ID)
	if err == nil && latest != nil {
		todayStart := time.Now().Truncate(24 * time.Hour)
		if strings.EqualFold(strings.TrimSpace(latest.Status), "Active") && !latest.EndDate.Before(todayStart) {
			// For class project: Instead of 409 Conflict, expire the old subscription and create the new one
			latest.Status = "Expired"
			h.subscriptionUsecase.UpdateSubscription(latest)
		}
	}
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	now := time.Now()
	startDate := now.Truncate(24 * time.Hour)
	newSub := &entity.Subscription{
		MemberID:         member.ID,
		PackageID:        pkg.ID,
		RegistrationDate: now,
		StartDate:        startDate,
		EndDate:          startDate.AddDate(0, 0, pkg.DurationDays),
		Status:           "Active",
	}

	if err := h.subscriptionUsecase.CreateSubscription(newSub); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(mapSubscriptionToMyPackageResponse(newSub, pkg, startDate))
}

func (h *MemberHandler) RenewMyPackage(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	var req dto.RenewMyPackageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.RenewalMonths <= 0 {
		http.Error(w, "renewal_months must be greater than 0", http.StatusBadRequest)
		return
	}

	var subscription *entity.Subscription
	if req.SubscriptionID > 0 {
		subscription, err = h.subscriptionUsecase.GetSubscriptionByID(req.SubscriptionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
	} else {
		subscription, err = h.subscriptionUsecase.GetLatestSubscriptionByMemberID(member.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
	}

	if subscription.MemberID != member.ID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	oldEndDate := subscription.EndDate
	baseDate := oldEndDate
	todayStart := time.Now().Truncate(24 * time.Hour)
	if baseDate.Before(todayStart) {
		baseDate = todayStart
	}

	subscription.EndDate = baseDate.AddDate(0, req.RenewalMonths, 0)
	subscription.Status = "Active"

	if err := h.subscriptionUsecase.UpdateSubscription(subscription); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	pkg, err := h.packageUsecase.GetPackageByID(subscription.PackageID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := dto.RenewMyPackageResponse{
		SubscriptionID: subscription.ID,
		PackageID:      pkg.ID,
		PackageName:    pkg.PackageName,
		RenewalMonths:  req.RenewalMonths,
		OldEndDate:     oldEndDate.Format(time.RFC3339),
		NewEndDate:     subscription.EndDate.Format(time.RFC3339),
		Status:         strings.ToLower(strings.TrimSpace(subscription.Status)),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func mapSubscriptionToMyPackageResponse(sub *entity.Subscription, pkg *entity.MembershipPackage, todayStart time.Time) *dto.MyPackageResponse {
	return &dto.MyPackageResponse{
		ID:             sub.ID,
		PackageID:      pkg.ID,
		Name:           pkg.PackageName,
		Price:          pkg.Price,
		DurationDays:   pkg.DurationDays,
		Status:         deriveMyPackageStatus(sub, todayStart),
		RegisteredDate: sub.RegistrationDate.Format(time.RFC3339),
		StartDate:      sub.StartDate.Format(time.RFC3339),
		EndDate:        sub.EndDate.Format(time.RFC3339),
	}
}

func deriveMyPackageStatus(sub *entity.Subscription, todayStart time.Time) string {
	rawStatus := strings.ToLower(strings.TrimSpace(sub.Status))

	switch rawStatus {
	case "paused", "transferred", "cancelled":
		return rawStatus
	}

	if sub.EndDate.Before(todayStart) {
		return "expired"
	}

	return "active"
}

func (h *MemberHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil || id <= 0 {
		http.Error(w, "invalid member id", http.StatusBadRequest)
		return
	}

	var payload struct {
		IsActive bool `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.usecase.UpdateMemberStatus(id, payload.IsActive); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *MemberHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteMember(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// GetMyTrainingHistory trả về lịch sử tập luyện của member hiện tại.
func (h *MemberHandler) GetMyTrainingHistory(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	sessions, err := h.sessionUsecase.GetTrainingHistoryByMemberID(member.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	bookings, err := h.bookingUsecase.GetTrainingBookingsByMemberID(member.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	bookingByID := make(map[int]*entity.TrainingBooking, len(bookings))
	for _, b := range bookings {
		bookingByID[b.ID] = b
	}

	resp := make([]*dto.MyTrainingHistoryItemResponse, 0, len(sessions))
	for _, session := range sessions {
		item := &dto.MyTrainingHistoryItemResponse{
			SessionID:        session.ID,
			BookingID:        session.BookingID,
			FacilityID:       session.FacilityID,
			SessionTime:      session.SessionTime.Format(time.RFC3339),
			AttendanceStatus: strings.ToLower(strings.TrimSpace(session.AttendanceStatus)),
			PTFeedback:       session.PTFeedback,
		}
		if b, ok := bookingByID[session.BookingID]; ok {
			item.PTID = b.PTID
			item.RequestedSchedule = b.RequestedSchedule
			item.BookingStatus = strings.ToLower(strings.TrimSpace(b.Status))
		}
		resp = append(resp, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// GetMySchedule trả về lịch tập sắp tới + booking requests của member hiện tại.
func (h *MemberHandler) GetMySchedule(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	bookings, err := h.bookingUsecase.GetTrainingBookingsByMemberID(member.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	upcomingSessions, err := h.sessionUsecase.GetUpcomingTrainingSessionsByMemberID(member.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	bookingByID := make(map[int]*entity.TrainingBooking, len(bookings))
	for _, b := range bookings {
		bookingByID[b.ID] = b
	}

	bookingsWithSession := make(map[int]bool)
	upcomingResp := make([]*dto.MyScheduleSessionItemResponse, 0, len(upcomingSessions))
	for _, session := range upcomingSessions {
		item := &dto.MyScheduleSessionItemResponse{
			SessionID:        session.ID,
			BookingID:        session.BookingID,
			FacilityID:       session.FacilityID,
			SessionTime:      session.SessionTime.Format(time.RFC3339),
			AttendanceStatus: strings.ToLower(strings.TrimSpace(session.AttendanceStatus)),
		}
		if b, ok := bookingByID[session.BookingID]; ok {
			item.PTID = b.PTID
			item.RequestedSchedule = b.RequestedSchedule
			item.BookingStatus = strings.ToLower(strings.TrimSpace(b.Status))
		}
		bookingsWithSession[session.BookingID] = true
		upcomingResp = append(upcomingResp, item)
	}

	bookingResp := make([]*dto.MyScheduleBookingItemResponse, 0)
	for _, b := range bookings {
		if bookingsWithSession[b.ID] {
			continue
		}
		bookingResp = append(bookingResp, &dto.MyScheduleBookingItemResponse{
			BookingID:         b.ID,
			PTID:              b.PTID,
			RequestedSchedule: b.RequestedSchedule,
			BookingStatus:     strings.ToLower(strings.TrimSpace(b.Status)),
			TrainingPlanNote:  b.TrainingPlanNote,
		})
	}

	resp := dto.MyScheduleResponse{
		UpcomingSessions: upcomingResp,
		BookingRequests:  bookingResp,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// GetMyFeedbacks trả về danh sách feedback của member hiện tại.
func (h *MemberHandler) GetMyFeedbacks(w http.ResponseWriter, r *http.Request) {
	member, err := h.resolveCurrentMember(r)
	if err != nil {
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		return
	}

	feedbacks, err := h.feedbackUsecase.GetFeedbacksByMemberID(member.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := make([]*dto.MyFeedbackItemResponse, 0, len(feedbacks))
	for _, fb := range feedbacks {
		resp = append(resp, &dto.MyFeedbackItemResponse{
			ID:             fb.ID,
			MemberID:       fb.MemberID,
			ProcessorID:    fb.ProcessorID,
			EquipmentID:    fb.EquipmentID,
			Content:        fb.Content,
			SentAt:         fb.SentAt.Format(time.RFC3339),
			ResolutionNote: fb.ResolutionNote,
			Status:         strings.ToLower(strings.TrimSpace(fb.Status)),
			Rating:         float64(fb.Rating),
			FeedbackType:   fb.FeedbackType,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *MemberHandler) resolveCurrentMember(r *http.Request) (*entity.Member, error) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		return nil, errors.New("unauthorized")
	}
	member, err := h.usecase.GetMemberByAccountID(user.AccountID)
	if err != nil {
		return nil, err
	}
	return member, nil
}
