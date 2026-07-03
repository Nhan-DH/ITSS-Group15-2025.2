package subscription_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateSubscription ───────────────────────────────────────────────────────

func TestCreateSubscription(t *testing.T) {
	tests := []struct {
		name      string
		input     *entity.Subscription
		setupMock func(*mockSubscriptionRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeSub(0, 1, 1),
			setupMock: func(m *mockSubscriptionRepo) {
				m.CreateFn = func(_ *entity.Subscription) error {
					return errors.New("db insert error")
				}
			},
			wantErrMsg: "db insert error",
		},
		{
			name:      "tạo subscription thành công",
			input:     makeSub(0, 2, 3),
			wantNoErr: true,
		},
		{
			name:  "repo gán ID sau khi tạo, subscription được cập nhật",
			input: makeSub(0, 5, 1),
			setupMock: func(m *mockSubscriptionRepo) {
				m.CreateFn = func(sub *entity.Subscription) error {
					sub.ID = 42
					return nil
				}
			},
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockSubscriptionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			err := uc.CreateSubscription(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	// Kiểm tra riêng: subscription pointer được cập nhật sau khi repo gán ID
	t.Run("subscription pointer được cập nhật với ID từ repo", func(t *testing.T) {
		repo := &mockSubscriptionRepo{
			CreateFn: func(sub *entity.Subscription) error {
				sub.ID = 99
				return nil
			},
		}
		sub := makeSub(0, 1, 1)
		err := newTestUsecase(repo).CreateSubscription(sub)
		assertNoError(t, err)
		if sub.ID != 99 {
			t.Errorf("expected subscription.ID = 99 after create, got %d", sub.ID)
		}
	})
}

// ─── GetSubscriptionByID ──────────────────────────────────────────────────────

func TestGetSubscriptionByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockSubscriptionRepo)
		wantErrMsg string
		wantID     int
	}{
		{
			name:       "id = 0 trả về invalid id",
			id:         0,
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			id:         -5,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetByIDFn = func(_ int) (*entity.Subscription, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy subscription thành công",
			id:   5,
			setupMock: func(m *mockSubscriptionRepo) {
				m.GetByIDFn = func(id int) (*entity.Subscription, error) {
					return makeSub(id, 1, 2), nil
				}
			},
			wantID: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockSubscriptionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			result, err := uc.GetSubscriptionByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
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

// ─── UpdateSubscription ───────────────────────────────────────────────────────

func TestUpdateSubscription(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.Subscription
		setupMock  func(*mockSubscriptionRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "ID = 0 trả về invalid id",
			input:      makeSub(0, 1, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:       "ID âm trả về invalid id",
			input:      makeSub(-1, 1, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeSub(3, 1, 1),
			setupMock: func(m *mockSubscriptionRepo) {
				m.UpdateFn = func(_ *entity.Subscription) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật subscription thành công",
			input:     makeSub(7, 2, 3),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockSubscriptionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			err := uc.UpdateSubscription(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}

// ─── DeleteSubscription ───────────────────────────────────────────────────────

func TestDeleteSubscription(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockSubscriptionRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			id:         0,
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			id:         -3,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockSubscriptionRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá subscription thành công",
			id:        10,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockSubscriptionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			uc := newTestUsecase(repo)
			err := uc.DeleteSubscription(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}

// ─── GetAllSubscriptions ──────────────────────────────────────────────────────

func TestGetAllSubscriptions(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockSubscriptionRepo{
			GetAllFn: func() ([]*entity.Subscription, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllSubscriptions()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có subscription", func(t *testing.T) {
		repo := &mockSubscriptionRepo{
			GetAllFn: func() ([]*entity.Subscription, error) {
				return []*entity.Subscription{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllSubscriptions()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng subscription", func(t *testing.T) {
		subs := []*entity.Subscription{makeSub(1, 1, 1), makeSub(2, 2, 1), makeSub(3, 3, 2)}
		repo := &mockSubscriptionRepo{
			GetAllFn: func() ([]*entity.Subscription, error) {
				return subs, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllSubscriptions()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 subscriptions, got %d", len(result))
		}
	})
}
