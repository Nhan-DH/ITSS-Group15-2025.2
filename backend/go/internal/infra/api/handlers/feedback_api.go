package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/feedback_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type FeedbackHandler struct {
	usecase       feedback_usecase.FeedbackUsecase
	memberUsecase member_usecase.MemberUsecase
}

func NewFeedbackHandler(u feedback_usecase.FeedbackUsecase, memberUsecase member_usecase.MemberUsecase) *FeedbackHandler {
	return &FeedbackHandler{usecase: u, memberUsecase: memberUsecase}
}

func (h *FeedbackHandler) Create(w http.ResponseWriter, r *http.Request) {
	var feedback entity.Feedback
	json.NewDecoder(r.Body).Decode(&feedback)

	// Set MemberID from authenticated user if role is MEMBER
	if user, ok := middleware.GetAuthenticatedUser(r); ok && strings.EqualFold(strings.TrimSpace(user.Role), "MEMBER") {
		currentMember, err := h.memberUsecase.GetMemberByAccountID(user.AccountID)
		if err == nil {
			feedback.MemberID = currentMember.ID
		}
	}
	
	feedback.SentAt = time.Now()

	err := h.usecase.CreateFeedback(&feedback)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedback)
}

func (h *FeedbackHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	feedback, err := h.usecase.GetFeedbackByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Ownership check: MEMBER chỉ xem feedback của chính mình.
	if user, ok := middleware.GetAuthenticatedUser(r); ok && strings.EqualFold(strings.TrimSpace(user.Role), "MEMBER") {
		currentMember, memberErr := h.memberUsecase.GetMemberByAccountID(user.AccountID)
		if memberErr != nil || currentMember.ID != feedback.MemberID {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedback)
}

func (h *FeedbackHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	status := r.URL.Query().Get("status")

	if pageStr != "" && limitStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 {
			limit = 6
		}

		feedbacks, total, err := h.usecase.GetAllFeedbacksPaginated(page, limit, status)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       feedbacks,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	feedbacks, err := h.usecase.GetAllFeedbacks()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedbacks)
}

func (h *FeedbackHandler) Update(w http.ResponseWriter, r *http.Request) {
	var feedback entity.Feedback
	json.NewDecoder(r.Body).Decode(&feedback)
	err := h.usecase.UpdateFeedback(&feedback)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *FeedbackHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteFeedback(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// UpdateStatus xử lý PATCH /feedbacks/{id}/status — cập nhật trạng thái feedback (cho staff).
func (h *FeedbackHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil || id <= 0 {
		http.Error(w, "invalid feedback id", http.StatusBadRequest)
		return
	}

	var req dto.UpdateFeedbackStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.Status) == "" {
		http.Error(w, "status is required", http.StatusBadRequest)
		return
	}

	if err := h.usecase.UpdateFeedbackStatus(id, strings.TrimSpace(req.Status), req.ResponseText); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":     id,
		"status": req.Status,
	})
}
