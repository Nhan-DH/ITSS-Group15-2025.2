package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/facility_usecase"

	"github.com/gorilla/mux"
)

type FacilityHandler struct {
	usecase facility_usecase.FacilityUsecase
}

func NewFacilityHandler(u facility_usecase.FacilityUsecase) *FacilityHandler {
	return &FacilityHandler{usecase: u}
}

func (h *FacilityHandler) Create(w http.ResponseWriter, r *http.Request) {
	var facility entity.Facility
	json.NewDecoder(r.Body).Decode(&facility)
	err := h.usecase.CreateFacility(&facility)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(facility)
}

func (h *FacilityHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	facility, err := h.usecase.GetFacilityByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(facility)
}

func (h *FacilityHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	facilities, err := h.usecase.GetAllFacilities()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(facilities)
}

func (h *FacilityHandler) Update(w http.ResponseWriter, r *http.Request) {
	var facility entity.Facility
	json.NewDecoder(r.Body).Decode(&facility)
	err := h.usecase.UpdateFacility(&facility)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *FacilityHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteFacility(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
