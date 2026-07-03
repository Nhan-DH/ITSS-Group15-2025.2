package equipment_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/equipment_usecase"
)

func newTestUsecase(repo *mockEquipmentRepo) equipment_usecase.EquipmentUsecase {
	return equipment_usecase.NewEquipmentUsecase(repo)
}

func makeEquipment(id int) *entity.Equipment {
	return &entity.Equipment{
		ID:                  id,
		FacilityID:          1,
		FacilityName:        "Main Hall",
		EquipmentName:       "Treadmill",
		SerialNumber:        "SN-001",
		Quantity:            5,
		Origin:              "USA",
		PurchaseDate:        time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC),
		MaintenanceDeadline: time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
		Status:              "Active",
	}
}

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
