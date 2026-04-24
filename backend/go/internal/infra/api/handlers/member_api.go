package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/infra/api/dto"

	"github.com/gorilla/mux"
)

type MemberHandler struct {
	usecase member_usecase.MemberUsecase
}

func NewMemberHandler(u member_usecase.MemberUsecase) *MemberHandler {
	return &MemberHandler{usecase: u}
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

	// Try to get member with details first
	memberDetail, err := h.usecase.GetMemberByIDWithDetails(id)
	if err == nil && memberDetail != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(memberDetail)
		return
	}

	// Fallback to basic member data
	member, err := h.usecase.GetMemberByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(member)
}

func (h *MemberHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Check for pagination parameters
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	// Try to get members with details
	membersDetail, err := h.usecase.GetAllMembersWithDetails()
	if err == nil && membersDetail != nil {
		// Apply pagination if requested
		if pageStr != "" && limitStr != "" {
			page, errPage := strconv.Atoi(pageStr)
			if errPage != nil || page < 1 {
				page = 1
			}
			limit, errLimit := strconv.Atoi(limitStr)
			if errLimit != nil || limit < 1 {
				limit = 10
			}

			totalItems := len(membersDetail)
			totalPages := (totalItems + limit - 1) / limit
			startIdx := (page - 1) * limit
			endIdx := startIdx + limit

			if startIdx >= totalItems {
				startIdx = 0
				endIdx = 0
			} else if endIdx > totalItems {
				endIdx = totalItems
			}

			var paginatedData []*dto.MemberListItemDTO
			if endIdx > startIdx {
				paginatedData = membersDetail[startIdx:endIdx]
			}

			response := dto.PaginationResponse{
				Data:       paginatedData,
				Page:       page,
				Limit:      limit,
				TotalItems: totalItems,
				TotalPages: totalPages,
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}

		// Return all data without pagination
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(membersDetail)
		return
	}

	// Fallback to basic member list with pagination
	if pageStr != "" && limitStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 {
			limit = 6
		}

		members, total, err := h.usecase.GetAllMembersPaginated(page, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       members,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

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
