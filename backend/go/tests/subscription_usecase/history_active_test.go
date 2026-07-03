package subscription_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetSubscriptionHistoryByMemberID ─────────────────────────────────────────

func TestGetSubscriptionHistoryByMemberID(t *testing.T) {
	tests := []struct {
		name       string
		memberID   int
		page       int
		limit      int
		setupMock  func(*mockSubscriptionRepo)
		wantErrMsg string
		wantCount  int
		wantTotal  int
	}{
		{
			name:     "lỗi repo trả về lỗi gốc",
			memberID: 1, page: 1, limit: 10,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetByMemberIDFn = func(_ int, _, _ int) ([]*entity.SubscriptionHistory, int, error) {
					return nil, 0, errors.New("db error")
				}
			},
			wantErrMsg: "db error",
		},
		{
			name:     "không có lịch sử trả về danh sách rỗng",
			memberID: 99, page: 1, limit: 10,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetByMemberIDFn = func(_ int, _, _ int) ([]*entity.SubscriptionHistory, int, error) {
					return []*entity.SubscriptionHistory{}, 0, nil
				}
			},
			wantCount: 0, wantTotal: 0,
		},
		{
			name:     "trả về đúng lịch sử và tổng số",
			memberID: 2, page: 1, limit: 5,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetByMemberIDFn = func(_ int, _, _ int) ([]*entity.SubscriptionHistory, int, error) {
					return []*entity.SubscriptionHistory{
						makeHistory(1), makeHistory(2), makeHistory(3),
					}, 3, nil
				}
			},
			wantCount: 3, wantTotal: 3,
		},
		{
			name:     "phân trang: page 2 với limit 2, tổng 5",
			memberID: 3, page: 2, limit: 2,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetByMemberIDFn = func(_ int, page, limit int) ([]*entity.SubscriptionHistory, int, error) {
					// repo nhận đúng tham số phân trang
					if page != 2 || limit != 2 {
						return nil, 0, errors.New("wrong pagination params")
					}
					return []*entity.SubscriptionHistory{makeHistory(3), makeHistory(4)}, 5, nil
				}
			},
			wantCount: 2, wantTotal: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockSubscriptionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			result, total, err := uc.GetSubscriptionHistoryByMemberID(tt.memberID, tt.page, tt.limit)

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

// ─── GetActiveSubscriptionByMemberID ─────────────────────────────────────────

func TestGetActiveSubscriptionByMemberID(t *testing.T) {
	tests := []struct {
		name       string
		memberID   int
		setupMock  func(*mockSubscriptionRepo)
		wantErrMsg string
		wantID     int
	}{
		{
			name:     "lỗi repo trả về lỗi gốc",
			memberID: 1,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetActiveByMemberIDFn = func(_ int) (*entity.Subscription, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name:     "lấy subscription active thành công",
			memberID: 5,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetActiveByMemberIDFn = func(memberID int) (*entity.Subscription, error) {
					return makeSub(10, memberID, 2), nil
				}
			},
			wantID: 10,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockSubscriptionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			result, err := uc.GetActiveSubscriptionByMemberID(tt.memberID)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
				return
			}
			assertNoError(t, err)
			if result == nil {
				t.Fatal("expected non-nil subscription")
			}
			if result.ID != tt.wantID {
				t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
			}
		})
	}
}

// ─── GetActiveSubscriptionByMemberIDAndCategoryID ────────────────────────────

func TestGetActiveSubscriptionByMemberIDAndCategoryID(t *testing.T) {
	tests := []struct {
		name       string
		memberID   int
		categoryID int
		setupMock  func(*mockSubscriptionRepo)
		wantErrMsg string
		wantID     int
	}{
		{
			name:       "lỗi repo trả về lỗi gốc",
			memberID:   1,
			categoryID: 2,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetActiveByMemberIDAndCategoryIDFn = func(_, _ int) (*entity.Subscription, error) {
					return nil, errors.New("no active subscription")
				}
			},
			wantErrMsg: "no active subscription",
		},
		{
			name:       "lấy đúng subscription theo memberID và categoryID",
			memberID:   3,
			categoryID: 1,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetActiveByMemberIDAndCategoryIDFn = func(memberID, _ int) (*entity.Subscription, error) {
					return makeSub(20, memberID, 1), nil
				}
			},
			wantID: 20,
		},
		{
			name:       "không tìm thấy subscription trả về nil",
			memberID:   7,
			categoryID: 3,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetActiveByMemberIDAndCategoryIDFn = func(_, _ int) (*entity.Subscription, error) {
					return nil, nil
				}
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockSubscriptionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			result, err := uc.GetActiveSubscriptionByMemberIDAndCategoryID(tt.memberID, tt.categoryID)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				return
			}
			assertNoError(t, err)
			if tt.wantID != 0 {
				if result == nil {
					t.Fatal("expected non-nil subscription")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}
