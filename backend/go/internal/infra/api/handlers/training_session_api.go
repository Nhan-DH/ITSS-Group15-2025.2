package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"

	"github.com/gorilla/mux"
)

type TrainingSessionHandler struct {
	usecase usecase.TrainingSessionUsecase
}

func NewTrainingSessionHandler(usecase usecase.TrainingSessionUsecase) *TrainingSessionHandler {
	return &TrainingSessionHandler{usecase: usecase}
}

func (h *TrainingSessionHandler) Create(w http.ResponseWriter, r *http.Request) {
	var trainingSession entity.TrainingSession
	if err := json.NewDecoder(r.Body).Decode(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.usecase.CreateTrainingSession(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(trainingSession)
}

func (h *TrainingSessionHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	trainingSession, err := h.usecase.GetTrainingSessionByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingSession)
}

func (h *TrainingSessionHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	trainingSessions, err := h.usecase.GetAllTrainingSessions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingSessions)
}

func (h *TrainingSessionHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var trainingSession entity.TrainingSession
	if err := json.NewDecoder(r.Body).Decode(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	trainingSession.ID = id

	if err := h.usecase.UpdateTrainingSession(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingSession)
}

func (h *TrainingSessionHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeleteTrainingSession(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
