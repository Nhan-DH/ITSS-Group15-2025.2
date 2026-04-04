package http

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase"

	"github.com/gorilla/mux"
)

type MemberHandler struct {
	usecase usecase.MemberUsecase
}

func NewMemberHandler(usecase usecase.MemberUsecase) *MemberHandler {
	return &MemberHandler{usecase: usecase}
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
	member, err := h.usecase.GetMemberByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(member)
}

func (h *MemberHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	members, err := h.usecase.GetAllMembers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(members)
}

func (h *MemberHandler) Update(w http.ResponseWriter, r *http.Request) {
	var member entity.Member
	json.NewDecoder(r.Body).Decode(&member)
	err := h.usecase.UpdateMember(&member)
	if err != nil {
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
