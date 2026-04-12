package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/usecase/account_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/mappers"

	"github.com/gorilla/mux"
)

type AccountHandler struct {
	usecase account_usecase.AccountUsecase
}

func NewAccountHandler(u account_usecase.AccountUsecase) *AccountHandler {
	return &AccountHandler{usecase: u}
}

func (h *AccountHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req dto.AccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	account := mappers.AccountRequestToEntity(&req)

	if err := h.usecase.CreateAccount(account); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(mappers.AccountEntityToResponse(account))
}

func (h *AccountHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	account, err := h.usecase.GetAccountByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mappers.AccountEntityToResponse(account))
}

func (h *AccountHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	accounts, err := h.usecase.GetAllAccounts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	responses := make([]*dto.AccountResponse, 0, len(accounts))
	for _, account := range accounts {
		responses = append(responses, mappers.AccountEntityToResponse(account))
	}

	json.NewEncoder(w).Encode(responses)
}

func (h *AccountHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req dto.AccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	account := mappers.AccountRequestToEntity(&req)
	account.ID = id

	if err := h.usecase.UpdateAccount(account); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mappers.AccountEntityToResponse(account))
}

func (h *AccountHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeleteAccount(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
