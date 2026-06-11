package training_session_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateTrainingSession ────────────────────────────────────────────────────

func TestCreateTrainingSession(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockTrainingSessionRepo{
			CreateFn: func(_ *entity.TrainingSession) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateTrainingSession(makeSession(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo session thành công", func(t *testing.T) {
		repo := &mockTrainingSessionRepo{}
		err := newTestUsecase(repo).CreateTrainingSession(makeSession(0))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, session pointer được cập nhật", func(t *testing.T) {
		repo := &mockTrainingSessionRepo{
			CreateFn: func(ts *entity.TrainingSession) error {
				ts.ID = 42
				return nil
			},
		}
		ts := makeSession(0)
		err := newTestUsecase(repo).CreateTrainingSession(ts)
		assertNoError(t, err)
		if ts.ID != 42 {
			t.Errorf("expected ts.ID = 42 after create, got %d", ts.ID)
		}
	})
}

// ─── GetTrainingSessionByID ───────────────────────────────────────────────────

func TestGetTrainingSessionByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockTrainingSessionRepo)
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
			setupMock: func(m *mockTrainingSessionRepo) {
				m.GetByIDFn = func(_ int) (*entity.TrainingSession, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy session thành công",
			id:   7,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.GetByIDFn = func(id int) (*entity.TrainingSession, error) {
					return makeSession(id), nil
				}
			},
			wantID: 7,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingSessionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetTrainingSessionByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil session")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdateTrainingSession ────────────────────────────────────────────────────

func TestUpdateTrainingSession(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.TrainingSession
		setupMock  func(*mockTrainingSessionRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "ID = 0 trả về invalid id",
			input:      makeSession(0),
			wantErrMsg: "invalid id",
		},
		{
			name:       "ID âm trả về invalid id",
			input:      makeSession(-1),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeSession(3),
			setupMock: func(m *mockTrainingSessionRepo) {
				m.UpdateFn = func(_ *entity.TrainingSession) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật session thành công",
			input:     makeSession(5),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingSessionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateTrainingSession(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("session pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockTrainingSessionRepo{
			UpdateFn: func(ts *entity.TrainingSession) error {
				ts.AttendanceStatus = "confirmed"
				ts.PTFeedback = "Good progress"
				ts.SessionResult = "Completed successfully"
				return nil
			},
		}
		ts := makeSession(10)
		err := newTestUsecase(repo).UpdateTrainingSession(ts)
		assertNoError(t, err)
		if ts.AttendanceStatus != "confirmed" {
			t.Errorf("expected AttendanceStatus = 'confirmed', got %q", ts.AttendanceStatus)
		}
		if ts.PTFeedback != "Good progress" {
			t.Errorf("expected PTFeedback = 'Good progress', got %q", ts.PTFeedback)
		}
		if ts.SessionResult != "Completed successfully" {
			t.Errorf("expected SessionResult = 'Completed successfully', got %q", ts.SessionResult)
		}
	})
}

// ─── DeleteTrainingSession ────────────────────────────────────────────────────

func TestDeleteTrainingSession(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockTrainingSessionRepo)
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
			id:         -2,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   4,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá session thành công",
			id:        9,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingSessionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteTrainingSession(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
