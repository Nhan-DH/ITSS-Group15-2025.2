package feedback_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/feedback_usecase"
)

func newTestUsecase(repo *mockFeedbackRepo) feedback_usecase.FeedbackUsecase {
	return feedback_usecase.NewFeedbackUsecase(repo)
}

func makeFeedback(id, memberID int) *entity.Feedback {
	return &entity.Feedback{
		ID:       id,
		MemberID: memberID,
		Content:  "Test feedback content",
		Status:   "pending",
		Rating:   4,
		SentAt:   time.Now(),
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
