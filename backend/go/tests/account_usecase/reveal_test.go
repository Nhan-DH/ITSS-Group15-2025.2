package account_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── RevealAccountPassword ────────────────────────────────────────────────────

func TestRevealAccountPassword(t *testing.T) {
	tests := []struct {
		name              string
		requesterID       int
		requesterPassword string
		targetID          int
		setupMock         func(*mockAccountRepo)
		wantErrMsg        string
		wantPassword      string
	}{
		{
			name:              "requesterID = 0 trả về requester not found",
			requesterID:       0,
			requesterPassword: "anypass",
			targetID:          2,
			// id <= 0 bị chặn bởi get usecase trước khi gọi repo
			wantErrMsg: "requester not found",
		},
		{
			name:              "repo lỗi khi lấy requester trả về requester not found",
			requesterID:       1,
			requesterPassword: "anypass",
			targetID:          2,
			setupMock: func(m *mockAccountRepo) {
				m.GetByIDFn = func(_ int) (*entity.Account, error) {
					return nil, errors.New("db error")
				}
			},
			wantErrMsg: "requester not found",
		},
		{
			name:              "mật khẩu requester sai trả về wrong password",
			requesterID:       1,
			requesterPassword: "wrongpass",
			targetID:          2,
			setupMock: func(m *mockAccountRepo) {
				m.GetByIDFn = func(id int) (*entity.Account, error) {
					if id == 1 {
						return &entity.Account{ID: 1, Password: "correctpass"}, nil
					}
					return nil, errors.New("should not reach here")
				}
			},
			wantErrMsg: "wrong password",
		},
		{
			name:              "targetID = 0 trả về account not found",
			requesterID:       1,
			requesterPassword: "correctpass",
			targetID:          0,
			setupMock: func(m *mockAccountRepo) {
				// chỉ được gọi cho requesterID=1; targetID=0 bị chặn trước khi gọi repo
				m.GetByIDFn = func(id int) (*entity.Account, error) {
					return &entity.Account{ID: id, Password: "correctpass"}, nil
				}
			},
			wantErrMsg: "account not found",
		},
		{
			name:              "repo lỗi khi lấy target trả về account not found",
			requesterID:       1,
			requesterPassword: "correctpass",
			targetID:          99,
			setupMock: func(m *mockAccountRepo) {
				m.GetByIDFn = func(id int) (*entity.Account, error) {
					if id == 1 {
						return &entity.Account{ID: 1, Password: "correctpass"}, nil
					}
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "account not found",
		},
		{
			name:              "thành công: trả về mật khẩu của target",
			requesterID:       1,
			requesterPassword: "requesterpass",
			targetID:          2,
			setupMock: func(m *mockAccountRepo) {
				m.GetByIDFn = func(id int) (*entity.Account, error) {
					if id == 1 {
						return &entity.Account{ID: 1, Password: "requesterpass"}, nil
					}
					if id == 2 {
						return &entity.Account{ID: 2, Password: "targetpass"}, nil
					}
					return nil, errors.New("not found")
				}
			},
			wantPassword: "targetpass",
		},
		{
			name:              "requester tự xem mật khẩu của mình",
			requesterID:       5,
			requesterPassword: "mypass123",
			targetID:          5,
			setupMock: func(m *mockAccountRepo) {
				m.GetByIDFn = func(id int) (*entity.Account, error) {
					return &entity.Account{ID: id, Password: "mypass123"}, nil
				}
			},
			wantPassword: "mypass123",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockAccountRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			password, err := newTestUsecase(repo).RevealAccountPassword(
				tt.requesterID, tt.requesterPassword, tt.targetID,
			)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if password != "" {
					t.Errorf("expected empty password on error, got %q", password)
				}
			} else {
				assertNoError(t, err)
				if password != tt.wantPassword {
					t.Errorf("password: got %q, want %q", password, tt.wantPassword)
				}
			}
		})
	}
}
