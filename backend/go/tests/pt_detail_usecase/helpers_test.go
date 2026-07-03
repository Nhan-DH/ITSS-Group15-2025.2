package pt_detail_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/pt_detail_usecase"
)

func newTestUsecase(repo *mockPTDetailRepo) pt_detail_usecase.PTDetailUsecase {
	return pt_detail_usecase.NewPTDetailUsecase(repo)
}

func makeDetail(employeeID int) *entity.PTDetail {
	return &entity.PTDetail{
		EmployeeID:          employeeID,
		FullName:            "Nguyen Van PT",
		Phone:               "0901234567",
		Email:               "pt@example.com",
		DOB:                 time.Date(1990, 6, 15, 0, 0, 0, 0, time.UTC),
		ProfessionalProfile: "Certified personal trainer",
		ExperienceYears:     "5",
	}
}

// --- Assertion helpers ---

func assertNoError(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Errorf("expected no error, got: %v", err)
	}
}

func assertErrorMsg(t *testing.T, got error, wantMsg string) {
	t.Helper()
	if got == nil {
		t.Errorf("expected error %q, got nil", wantMsg)
		return
	}
	if got.Error() != wantMsg {
		t.Errorf("expected error %q, got %q", wantMsg, got.Error())
	}
}

func assertErrorIs(t *testing.T, got, want error) {
	t.Helper()
	if got == nil {
		t.Errorf("expected error %v, got nil", want)
		return
	}
	if !errors.Is(got, want) {
		t.Errorf("expected errors.Is(%v), got: %v", want, got)
	}
}
