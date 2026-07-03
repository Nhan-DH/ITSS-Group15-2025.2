package training_session_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllTrainingSessions ───────────────────────────────────────────────────

func TestGetAllTrainingSessions(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockTrainingSessionRepo{
			GetAllFn: func() ([]*entity.TrainingSession, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllTrainingSessions()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có session", func(t *testing.T) {
		repo := &mockTrainingSessionRepo{
			GetAllFn: func() ([]*entity.TrainingSession, error) {
				return []*entity.TrainingSession{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllTrainingSessions()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng session", func(t *testing.T) {
		sessions := []*entity.TrainingSession{makeSession(1), makeSession(2), makeSession(3)}
		repo := &mockTrainingSessionRepo{
			GetAllFn: func() ([]*entity.TrainingSession, error) {
				return sessions, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllTrainingSessions()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 sessions, got %d", len(result))
		}
	})
}

// ─── GetSessionsByPTEmployeeID ────────────────────────────────────────────────

func TestGetSessionsByPTEmployeeID(t *testing.T) {
	tests := []struct {
		name       string
		employeeID int
		setupMock  func(*mockTrainingSessionRepo)
		wantErrMsg string
		wantCount  int
	}{
		{
			name:       "lỗi repo trả về lỗi gốc",
			employeeID: 1,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.GetByPTEmployeeIDFn = func(_ int) ([]*entity.TrainingSession, error) {
					return nil, errors.New("db error")
				}
			},
			wantErrMsg: "db error",
		},
		{
			name:       "trả về danh sách rỗng khi PT chưa có session",
			employeeID: 2,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.GetByPTEmployeeIDFn = func(_ int) ([]*entity.TrainingSession, error) {
					return []*entity.TrainingSession{}, nil
				}
			},
			wantCount: 0,
		},
		{
			name:       "trả về đúng số lượng session của PT",
			employeeID: 5,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.GetByPTEmployeeIDFn = func(_ int) ([]*entity.TrainingSession, error) {
					return []*entity.TrainingSession{makeSession(1), makeSession(2), makeSession(3)}, nil
				}
			},
			wantCount: 3,
		},
		{
			name:       "repo nhận đúng employeeID",
			employeeID: 11,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.GetByPTEmployeeIDFn = func(employeeID int) ([]*entity.TrainingSession, error) {
					if employeeID != 11 {
						return nil, errors.New("wrong employeeID passed to repo")
					}
					return []*entity.TrainingSession{makeSession(10)}, nil
				}
			},
			wantCount: 1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingSessionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetSessionsByPTEmployeeID(tt.employeeID)

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

// ─── ConfirmAttendance ────────────────────────────────────────────────────────

func TestConfirmAttendance(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		memberID   int
		setupMock  func(*mockTrainingSessionRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:     "lỗi repo trả về lỗi gốc",
			id:       1,
			memberID: 2,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.ConfirmAttendanceFn = func(_, _ int) error {
					return errors.New("confirm error")
				}
			},
			wantErrMsg: "confirm error",
		},
		{
			name:      "xác nhận điểm danh thành công",
			id:        3,
			memberID:  5,
			wantNoErr: true,
		},
		{
			name:     "repo nhận đúng id của session",
			id:       7,
			memberID: 1,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.ConfirmAttendanceFn = func(id, _ int) error {
					if id != 7 {
						return errors.New("wrong session id passed to repo")
					}
					return nil
				}
			},
			wantNoErr: true,
		},
		{
			name:     "repo nhận đúng memberID",
			id:       2,
			memberID: 99,
			setupMock: func(m *mockTrainingSessionRepo) {
				m.ConfirmAttendanceFn = func(_, memberID int) error {
					if memberID != 99 {
						return errors.New("wrong memberID passed to repo")
					}
					return nil
				}
			},
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockTrainingSessionRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).ConfirmAttendance(tt.id, tt.memberID)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
