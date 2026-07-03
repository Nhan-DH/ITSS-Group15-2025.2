package feedback_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllFeedbacks ──────────────────────────────────────────────────────────

func TestGetAllFeedbacks(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockFeedbackRepo{
			GetAllFn: func() ([]*entity.Feedback, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllFeedbacks()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có feedback", func(t *testing.T) {
		repo := &mockFeedbackRepo{
			GetAllFn: func() ([]*entity.Feedback, error) {
				return []*entity.Feedback{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllFeedbacks()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng feedback", func(t *testing.T) {
		feedbacks := []*entity.Feedback{makeFeedback(1, 1), makeFeedback(2, 2), makeFeedback(3, 3)}
		repo := &mockFeedbackRepo{
			GetAllFn: func() ([]*entity.Feedback, error) {
				return feedbacks, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllFeedbacks()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 feedbacks, got %d", len(result))
		}
	})
}

// ─── GetAllFeedbacksPaginated ─────────────────────────────────────────────────

func TestGetAllFeedbacksPaginated(t *testing.T) {
	tests := []struct {
		name       string
		page       int
		limit      int
		status     string
		setupMock  func(*mockFeedbackRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			page: 1, limit: 10, status: "",
			setupMock: func(m *mockFeedbackRepo) {
				m.GetAllPaginatedFn = func(_, _ int, _ string) ([]*entity.Feedback, int, error) {
					return nil, 0, errors.New("db pagination error")
				}
			},
			wantErrMsg: "db pagination error",
		},
		{
			name: "trả về đúng danh sách và tổng số",
			page: 1, limit: 5, status: "",
			setupMock: func(m *mockFeedbackRepo) {
				m.GetAllPaginatedFn = func(_, _ int, _ string) ([]*entity.Feedback, int, error) {
					return []*entity.Feedback{makeFeedback(1, 1), makeFeedback(2, 2)}, 10, nil
				}
			},
			wantCount: 2, wantTotal: 10,
		},
		{
			name: "lọc theo status 'pending': repo nhận đúng status",
			page: 1, limit: 10, status: "pending",
			setupMock: func(m *mockFeedbackRepo) {
				m.GetAllPaginatedFn = func(_, _ int, status string) ([]*entity.Feedback, int, error) {
					if status != "pending" {
						return nil, 0, errors.New("wrong status passed to repo")
					}
					return []*entity.Feedback{makeFeedback(1, 1)}, 1, nil
				}
			},
			wantCount: 1, wantTotal: 1,
		},
		{
			name: "lọc theo status 'resolved': repo nhận đúng status",
			page: 1, limit: 10, status: "resolved",
			setupMock: func(m *mockFeedbackRepo) {
				m.GetAllPaginatedFn = func(_, _ int, status string) ([]*entity.Feedback, int, error) {
					if status != "resolved" {
						return nil, 0, errors.New("wrong status passed to repo")
					}
					return []*entity.Feedback{makeFeedback(3, 2), makeFeedback(4, 3)}, 5, nil
				}
			},
			wantCount: 2, wantTotal: 5,
		},
		{
			name: "phân trang: repo nhận đúng page và limit",
			page: 2, limit: 3, status: "",
			setupMock: func(m *mockFeedbackRepo) {
				m.GetAllPaginatedFn = func(page, limit int, _ string) ([]*entity.Feedback, int, error) {
					if page != 2 || limit != 3 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.Feedback{makeFeedback(4, 1)}, 7, nil
				}
			},
			wantCount: 1, wantTotal: 7,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFeedbackRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, total, err := newTestUsecase(repo).GetAllFeedbacksPaginated(tt.page, tt.limit, tt.status)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				return
			}
			assertNoError(t, err)
			if len(result) != tt.wantCount {
				t.Errorf("result count: got %d, want %d", len(result), tt.wantCount)
			}
			if total != tt.wantTotal {
				t.Errorf("total: got %d, want %d", total, tt.wantTotal)
			}
		})
	}
}

// ─── GetFeedbacksByMemberID ───────────────────────────────────────────────────

func TestGetFeedbacksByMemberID(t *testing.T) {
	tests := []struct {
		name       string
		memberID   int
		setupMock  func(*mockFeedbackRepo)
		wantErrMsg string
		wantCount  int
	}{
		{
			name:     "lỗi repo trả về lỗi gốc",
			memberID: 1,
			setupMock: func(m *mockFeedbackRepo) {
				m.GetByMemberIDFn = func(_ int) ([]*entity.Feedback, error) {
					return nil, errors.New("db error")
				}
			},
			wantErrMsg: "db error",
		},
		{
			name:     "trả về danh sách rỗng khi member chưa có feedback",
			memberID: 2,
			setupMock: func(m *mockFeedbackRepo) {
				m.GetByMemberIDFn = func(_ int) ([]*entity.Feedback, error) {
					return []*entity.Feedback{}, nil
				}
			},
			wantCount: 0,
		},
		{
			name:     "trả về đúng số lượng feedback của member",
			memberID: 5,
			setupMock: func(m *mockFeedbackRepo) {
				m.GetByMemberIDFn = func(_ int) ([]*entity.Feedback, error) {
					return []*entity.Feedback{makeFeedback(1, 5), makeFeedback(2, 5)}, nil
				}
			},
			wantCount: 2,
		},
		{
			name:     "repo nhận đúng memberID",
			memberID: 9,
			setupMock: func(m *mockFeedbackRepo) {
				m.GetByMemberIDFn = func(memberID int) ([]*entity.Feedback, error) {
					if memberID != 9 {
						return nil, errors.New("wrong memberID passed to repo")
					}
					return []*entity.Feedback{makeFeedback(10, 9)}, nil
				}
			},
			wantCount: 1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFeedbackRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetFeedbacksByMemberID(tt.memberID)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				return
			}
			assertNoError(t, err)
			if len(result) != tt.wantCount {
				t.Errorf("result count: got %d, want %d", len(result), tt.wantCount)
			}
		})
	}
}
