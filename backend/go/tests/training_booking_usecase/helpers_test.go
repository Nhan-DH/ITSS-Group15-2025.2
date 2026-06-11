package training_booking_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/training_booking_usecase"
)

func newTestUsecase(repo *mockTrainingBookingRepo) training_booking_usecase.TrainingBookingUsecase {
	return training_booking_usecase.NewTrainingBookingUsecase(repo)
}

func makeBooking(id int) *entity.TrainingBooking {
	return &entity.TrainingBooking{
		ID:               id,
		MemberID:         10,
		PTID:             20,
		RequestedStart:   time.Now().Add(24 * time.Hour),
		RequestedEnd:     time.Now().Add(26 * time.Hour),
		TrainingPlanNote: "Focus on cardio",
		Status:           "pending",
		Intensity:        "medium",
		RoadmapGoal:      "Lose weight",
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
