package feedback_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

// IGetFeedbacksByMemberUseCase lấy danh sách feedback theo member.
type IGetFeedbacksByMemberUseCase interface {
	Execute(ctx context.Context, memberID int) ([]*entity.Feedback, error)
}

type getFeedbacksByMemberUseCase struct {
	repo adapter.FeedbackRepository
}

func NewGetFeedbacksByMemberUseCase(repo adapter.FeedbackRepository) IGetFeedbacksByMemberUseCase {
	return &getFeedbacksByMemberUseCase{repo: repo}
}

func (uc *getFeedbacksByMemberUseCase) Execute(ctx context.Context, memberID int) ([]*entity.Feedback, error) {
	return uc.repo.GetByMemberID(memberID)
}

// IUpdateFeedbackStatusUseCase cập nhật status của feedback.
type IUpdateFeedbackStatusUseCase interface {
	Execute(ctx context.Context, id int, status, resolutionNote string) error
}

type updateFeedbackStatusUseCase struct {
	repo adapter.FeedbackRepository
}

func NewUpdateFeedbackStatusUseCase(repo adapter.FeedbackRepository) IUpdateFeedbackStatusUseCase {
	return &updateFeedbackStatusUseCase{repo: repo}
}

func (uc *updateFeedbackStatusUseCase) Execute(ctx context.Context, id int, status, resolutionNote string) error {
	return uc.repo.UpdateStatus(id, status, resolutionNote)
}
