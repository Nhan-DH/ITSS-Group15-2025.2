package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"

	"github.com/gorilla/mux"
)

type TrainingBookingHandler struct {
	usecase usecase.TrainingBookingUsecase
}

func NewTrainingBookingHandler(usecase usecase.TrainingBookingUsecase) *TrainingBookingHandler {
	return &TrainingBookingHandler{usecase: usecase}
}

func (h *TrainingBookingHandler) Create(w http.ResponseWriter, r *http.Request) {
	var trainingBooking entity.TrainingBooking
	if err := json.NewDecoder(r.Body).Decode(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.usecase.CreateTrainingBooking(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(trainingBooking)
}

func (h *TrainingBookingHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	trainingBooking, err := h.usecase.GetTrainingBookingByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingBooking)
}

func (h *TrainingBookingHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	trainingBookings, err := h.usecase.GetAllTrainingBookings()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingBookings)
}

func (h *TrainingBookingHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var trainingBooking entity.TrainingBooking
	if err := json.NewDecoder(r.Body).Decode(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	trainingBooking.ID = id

	if err := h.usecase.UpdateTrainingBooking(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingBooking)
}

func (h *TrainingBookingHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeleteTrainingBooking(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
