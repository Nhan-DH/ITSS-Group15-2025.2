package facility_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/facility_usecase"
)

func newTestUsecase(repo *mockFacilityRepo) facility_usecase.FacilityUsecase {
	return facility_usecase.NewFacilityUsecase(repo)
}

func makeFacility(id int) *entity.Facility {
	return &entity.Facility{
		ID:           id,
		FacilityName: "Test Facility",
		FacilityType: "gym",
		Status:       "Operating",
		MaxCapacity:  50,
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
