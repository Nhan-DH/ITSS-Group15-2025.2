package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/equipment_usecase"

	"github.com/gorilla/mux"
)

type EquipmentHandler struct {
	usecase equipment_usecase.EquipmentUsecase
}

func NewEquipmentHandler(u equipment_usecase.EquipmentUsecase) *EquipmentHandler {
	return &EquipmentHandler{usecase: u}
}

func (h *EquipmentHandler) Create(w http.ResponseWriter, r *http.Request) {
	var equipment entity.Equipment
	json.NewDecoder(r.Body).Decode(&equipment)
	err := h.usecase.CreateEquipment(&equipment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(equipment)
}

func (h *EquipmentHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	equipment, err := h.usecase.GetEquipmentByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(equipment)
}

func (h *EquipmentHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	equipments, err := h.usecase.GetAllEquipments()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(equipments)
}

func (h *EquipmentHandler) Update(w http.ResponseWriter, r *http.Request) {
	var equipment entity.Equipment
	json.NewDecoder(r.Body).Decode(&equipment)
	err := h.usecase.UpdateEquipment(&equipment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *EquipmentHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteEquipment(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
