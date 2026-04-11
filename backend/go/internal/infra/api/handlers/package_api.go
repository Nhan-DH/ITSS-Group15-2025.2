package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/package_usecase"

	"github.com/gorilla/mux"
)

type PackageHandler struct {
	usecase package_usecase.PackageUsecase
}

func NewPackageHandler(usecase usecase.PackageUsecase) *PackageHandler {
	return &PackageHandler{usecase: usecase}
}

func (h *PackageHandler) Create(w http.ResponseWriter, r *http.Request) {
	var pkg entity.MembershipPackage
	json.NewDecoder(r.Body).Decode(&pkg)
	err := h.usecase.CreatePackage(&pkg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pkg)
}

func (h *PackageHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	pkg, err := h.usecase.GetPackageByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pkg)
}

func (h *PackageHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	packages, err := h.usecase.GetAllPackages()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(packages)
}

func (h *PackageHandler) Update(w http.ResponseWriter, r *http.Request) {
	var pkg entity.MembershipPackage
	json.NewDecoder(r.Body).Decode(&pkg)
	err := h.usecase.UpdatePackage(&pkg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *PackageHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeletePackage(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
