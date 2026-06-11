package training_booking_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateTrainingBooking ────────────────────────────────────────────────────

func TestCreateTrainingBooking(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockTrainingBookingRepo{
			CreateFn: func(_ *entity.TrainingBooking) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateTrainingBooking(makeBooking(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo training booking thành công", func(t *testing.T) {
		repo := &mockTrainingBookingRepo{}
		err := newTestUsecase(repo).CreateTrainingBooking(makeBooking(1))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, pointer được cập nhật", func(t *testing.T) {
		repo := &mockTrainingBookingRepo{
			CreateFn: func(tb *entity.TrainingBooking) error {
				tb.ID = 88
				return nil
			},
		}
		tb := makeBooking(0)
		err := newTestUsecase(repo).CreateTrainingBooking(tb)
		assertNoError(t, err)
		if tb.ID != 88 {
			t.Errorf("expected ID = 88 after create, got %d", tb.ID)
		}
	})
}

// ─── GetTrainingBookingByID ───────────────────────────────────────────────────

func TestGetTrainingBookingByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockTrainingBookingRepo)
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
			id:         -7,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockTrainingBookingRepo) {
				m.GetByIDFn = func(_ int) (*entity.TrainingBooking, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy training booking thành công",
			id:   5,
			setupMock: func(m *mockTrainingBookingRepo) {
				m.GetByIDFn = func(id int) (*entity.TrainingBooking, error) {
					return makeBooking(id), nil
				}
			},
			wantID: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingBookingRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetTrainingBookingByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil training booking")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── GetAllTrainingBookings ───────────────────────────────────────────────────

func TestGetAllTrainingBookings(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockTrainingBookingRepo{
			GetAllFn: func() ([]*entity.TrainingBooking, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllTrainingBookings()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có booking", func(t *testing.T) {
		repo := &mockTrainingBookingRepo{
			GetAllFn: func() ([]*entity.TrainingBooking, error) {
				return []*entity.TrainingBooking{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllTrainingBookings()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng booking", func(t *testing.T) {
		bookings := []*entity.TrainingBooking{makeBooking(1), makeBooking(2)}
		repo := &mockTrainingBookingRepo{
			GetAllFn: func() ([]*entity.TrainingBooking, error) {
				return bookings, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllTrainingBookings()
		assertNoError(t, err)
		if len(result) != 2 {
			t.Errorf("expected 2 bookings, got %d", len(result))
		}
	})
}

// ─── UpdateTrainingBooking ────────────────────────────────────────────────────

func TestUpdateTrainingBooking(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.TrainingBooking
		setupMock  func(*mockTrainingBookingRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			input:      makeBooking(0),
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			input:      makeBooking(-2),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeBooking(4),
			setupMock: func(m *mockTrainingBookingRepo) {
				m.UpdateFn = func(_ *entity.TrainingBooking) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật training booking thành công",
			input:     makeBooking(6),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingBookingRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateTrainingBooking(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockTrainingBookingRepo{
			UpdateFn: func(tb *entity.TrainingBooking) error {
				tb.Status = "approved"
				tb.RejectionReason = ""
				return nil
			},
		}
		tb := makeBooking(3)
		err := newTestUsecase(repo).UpdateTrainingBooking(tb)
		assertNoError(t, err)
		if tb.Status != "approved" {
			t.Errorf("expected Status = 'approved', got %q", tb.Status)
		}
		if tb.RejectionReason != "" {
			t.Errorf("expected empty RejectionReason, got %q", tb.RejectionReason)
		}
	})
}

// ─── DeleteTrainingBooking ────────────────────────────────────────────────────

func TestDeleteTrainingBooking(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockTrainingBookingRepo)
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
			setupMock: func(m *mockTrainingBookingRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá training booking thành công",
			id:        7,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingBookingRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteTrainingBooking(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
