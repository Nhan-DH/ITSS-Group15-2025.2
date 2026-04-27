package training_booking_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

// IGetTrainingBookingsByMemberUseCase lấy danh sách booking theo member.
type IGetTrainingBookingsByMemberUseCase interface {
	Execute(ctx context.Context, memberID int) ([]*entity.TrainingBooking, error)
}

type getTrainingBookingsByMemberUseCase struct {
	repo adapter.TrainingBookingRepository
}

func NewGetTrainingBookingsByMemberUseCase(repo adapter.TrainingBookingRepository) IGetTrainingBookingsByMemberUseCase {
	return &getTrainingBookingsByMemberUseCase{repo: repo}
}

func (uc *getTrainingBookingsByMemberUseCase) Execute(ctx context.Context, memberID int) ([]*entity.TrainingBooking, error) {
	return uc.repo.GetByMemberID(memberID)
}
