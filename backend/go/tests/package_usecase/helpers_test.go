package package_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/package_usecase"
)

func newTestUsecase(repo *mockPackageRepo) package_usecase.PackageUsecase {
	return package_usecase.NewPackageUsecase(repo)
}

func makePkg(id, categoryID int) *entity.MembershipPackage {
	return &entity.MembershipPackage{
		ID:            id,
		CategoryID:    categoryID,
		PackageName:   "Test Package",
		DurationDays:  30,
		Price:         500000,
		IsActive:      true,
		AllowedGender: "all",
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
