package service_category_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/service_category_usecase"
)

func newTestUsecase(repo *mockServiceCategoryRepo) service_category_usecase.ServiceCategoryUsecase {
	return service_category_usecase.NewServiceCategoryUsecase(repo)
}

func makeCategory(id int) *entity.ServiceCategory {
	return &entity.ServiceCategory{
		ID:                  id,
		CategoryName:        "Yoga",
		BenefitsDescription: "Improves flexibility",
		AllowedGender:       "All",
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
