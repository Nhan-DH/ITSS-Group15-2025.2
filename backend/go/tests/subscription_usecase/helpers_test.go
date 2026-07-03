package subscription_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/subscription_usecase"
)

func newTestUsecase(repo *mockSubscriptionRepo) subscription_usecase.SubscriptionUsecase {
	return subscription_usecase.NewSubscriptionUsecase(repo)
}

func makeSub(id, memberID, packageID int) *entity.Subscription {
	return &entity.Subscription{
		ID:               id,
		MemberID:         memberID,
		PackageID:        packageID,
		RegistrationDate: time.Now().UTC(),
		StartDate:        time.Now().UTC(),
		EndDate:          time.Now().UTC().Add(30 * 24 * time.Hour),
		Status:           "active",
	}
}

func makeHistory(id int) *entity.SubscriptionHistory {
	return &entity.SubscriptionHistory{
		ID:         id,
		PackageID:  1,
		CategoryID: 1,
		Status:     "expired",
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
