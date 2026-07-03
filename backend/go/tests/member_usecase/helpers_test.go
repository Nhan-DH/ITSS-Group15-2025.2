package member_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/member_usecase"
)

func newTestUsecase(repo *mockMemberRepo) member_usecase.MemberUsecase {
	return member_usecase.NewMemberUsecase(repo)
}

func makeMember(id, accountID int) *entity.Member {
	return &entity.Member{
		ID:           id,
		FullName:     "Test Member",
		Phone:        "0123456789",
		Email:        "test@example.com",
		Gender:       "male",
		DOB:          time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
		AccountID:    accountID,
		IsActive:     true,
		RegisteredAt: time.Now().UTC(),
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
