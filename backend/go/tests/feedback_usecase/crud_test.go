package feedback_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
)

// ─── CreateFeedback ───────────────────────────────────────────────────────────

func TestCreateFeedback(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockFeedbackRepo{
			CreateFn: func(_ *entity.Feedback) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateFeedback(makeFeedback(0, 1))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo feedback thành công", func(t *testing.T) {
		repo := &mockFeedbackRepo{}
		err := newTestUsecase(repo).CreateFeedback(makeFeedback(0, 2))
		assertNoError(t, err)
	})

	t.Run("SentAt zero được tự động điền thời gian hiện tại", func(t *testing.T) {
		repo := &mockFeedbackRepo{}
		fb := makeFeedback(0, 1)
		fb.SentAt = time.Time{} // zero value
		before := time.Now()
		err := newTestUsecase(repo).CreateFeedback(fb)
		assertNoError(t, err)
		if fb.SentAt.IsZero() {
			t.Error("expected SentAt to be set, got zero value")
		}
		if fb.SentAt.Before(before) {
			t.Errorf("expected SentAt >= %v, got %v", before, fb.SentAt)
		}
	})

	t.Run("SentAt đã có sẵn thì không bị ghi đè", func(t *testing.T) {
		repo := &mockFeedbackRepo{}
		fixedTime := time.Date(2024, 1, 15, 10, 0, 0, 0, time.UTC)
		fb := makeFeedback(0, 1)
		fb.SentAt = fixedTime
		err := newTestUsecase(repo).CreateFeedback(fb)
		assertNoError(t, err)
		if !fb.SentAt.Equal(fixedTime) {
			t.Errorf("expected SentAt = %v, got %v", fixedTime, fb.SentAt)
		}
	})

	t.Run("repo gán ID sau khi tạo, feedback pointer được cập nhật", func(t *testing.T) {
		repo := &mockFeedbackRepo{
			CreateFn: func(fb *entity.Feedback) error {
				fb.ID = 33
				return nil
			},
		}
		fb := makeFeedback(0, 1)
		err := newTestUsecase(repo).CreateFeedback(fb)
		assertNoError(t, err)
		if fb.ID != 33 {
			t.Errorf("expected fb.ID = 33 after create, got %d", fb.ID)
		}
	})
}

// ─── GetFeedbackByID ──────────────────────────────────────────────────────────

func TestGetFeedbackByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockFeedbackRepo)
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
			id:         -2,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockFeedbackRepo) {
				m.GetByIDFn = func(_ int) (*entity.Feedback, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy feedback thành công",
			id:   5,
			setupMock: func(m *mockFeedbackRepo) {
				m.GetByIDFn = func(id int) (*entity.Feedback, error) {
					return makeFeedback(id, 1), nil
				}
			},
			wantID: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFeedbackRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetFeedbackByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil feedback")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdateFeedback ───────────────────────────────────────────────────────────

func TestUpdateFeedback(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.Feedback
		setupMock  func(*mockFeedbackRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "ID = 0 trả về invalid id",
			input:      makeFeedback(0, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:       "ID âm trả về invalid id",
			input:      makeFeedback(-1, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeFeedback(3, 1),
			setupMock: func(m *mockFeedbackRepo) {
				m.UpdateFn = func(_ *entity.Feedback) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật feedback thành công",
			input:     makeFeedback(7, 2),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFeedbackRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateFeedback(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("feedback pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockFeedbackRepo{
			UpdateFn: func(fb *entity.Feedback) error {
				fb.Status = "resolved"
				fb.ResolutionNote = "Issue fixed"
				return nil
			},
		}
		fb := makeFeedback(4, 1)
		err := newTestUsecase(repo).UpdateFeedback(fb)
		assertNoError(t, err)
		if fb.Status != "resolved" {
			t.Errorf("expected Status = 'resolved', got %q", fb.Status)
		}
		if fb.ResolutionNote != "Issue fixed" {
			t.Errorf("expected ResolutionNote = 'Issue fixed', got %q", fb.ResolutionNote)
		}
	})
}

// ─── DeleteFeedback ───────────────────────────────────────────────────────────

func TestDeleteFeedback(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockFeedbackRepo)
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
			id:   2,
			setupMock: func(m *mockFeedbackRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá feedback thành công",
			id:        8,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFeedbackRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteFeedback(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
