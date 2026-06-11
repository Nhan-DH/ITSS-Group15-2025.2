package employee_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/employee_usecase"
)

func newTestUsecase(repo *mockEmployeeRepo) employee_usecase.EmployeeUsecase {
	return employee_usecase.NewEmployeeUsecase(repo)
}

func makeEmployee(id, accountID int) *entity.Employee {
	return &entity.Employee{
		ID:        id,
		FullName:  "Nguyen Van A",
		Phone:     "0901234567",
		Position:  "PT",
		Salary:    5000000,
		AccountID: accountID,
		Gender:    "male",
		DOB:       time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
		Email:     "nva@example.com",
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
