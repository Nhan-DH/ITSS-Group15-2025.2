package training_session_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/training_session_usecase"
)

func newTestUsecase(repo *mockTrainingSessionRepo) training_session_usecase.TrainingSessionUsecase {
	return training_session_usecase.NewTrainingSessionUsecase(repo)
}

func makeSession(id int) *entity.TrainingSession {
	return &entity.TrainingSession{
		ID:               id,
		BookingID:        1,
		FacilityID:       2,
		SessionTime:      time.Now().Add(24 * time.Hour),
		AttendanceStatus: "pending",
		PTFeedback:       "",
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
