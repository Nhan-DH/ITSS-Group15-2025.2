package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/feedback_usecase"

	"github.com/gorilla/mux"
)

type FeedbackHandler struct {
	usecase feedback_usecase.FeedbackUsecase
}

func NewFeedbackHandler(usecase usecase.FeedbackUsecase) *FeedbackHandler {
	return &FeedbackHandler{usecase: usecase}
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
	json.NewEncoder(w).Encode(feedback)
}

func (h *FeedbackHandler) GetAll(w http.ResponseWriter, r *http.Request) {
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
