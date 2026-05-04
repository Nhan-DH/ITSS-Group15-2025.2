package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/feedback_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/mappers"

	"github.com/gorilla/mux"
)

type FeedbackHandler struct {
	usecase feedback_usecase.FeedbackUsecase
}

func NewFeedbackHandler(u feedback_usecase.FeedbackUsecase) *FeedbackHandler {
	return &FeedbackHandler{usecase: u}
}

func (h *FeedbackHandler) Create(w http.ResponseWriter, r *http.Request) {
	var feedback entity.Feedback
	json.NewDecoder(r.Body).Decode(&feedback)
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
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mappers.FeedbackEntityToResponse(feedback))
}

func (h *FeedbackHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Check for pagination and filter parameters
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

		feedbackResponses := make([]*dto.FeedbackResponse, len(feedbacks))
		for i, fb := range feedbacks {
			feedbackResponses[i] = mappers.FeedbackEntityToResponse(fb)
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       feedbackResponses,
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
	responses := make([]*dto.FeedbackResponse, len(feedbacks))
	for i, fb := range feedbacks {
		responses[i] = mappers.FeedbackEntityToResponse(fb)
	}
	json.NewEncoder(w).Encode(responses)
}

func (h *FeedbackHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)

	existing, err := h.usecase.GetFeedbackByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if status, ok := req["status"].(string); ok {
		existing.Status = status
	}
	if responseText, ok := req["response_text"].(string); ok {
		existing.ResolutionNote = responseText
	} else if resolutionNote, ok := req["resolution_note"].(string); ok {
		existing.ResolutionNote = resolutionNote
	}

	err = h.usecase.UpdateFeedback(existing)
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
