package subscription_test

import (
	"errors"
	"testing"
	"time"
)

// ─── RenewSubscription ────────────────────────────────────────────────────────

func TestRenewSubscription(t *testing.T) {
	futureDate := time.Now().UTC().Add(30 * 24 * time.Hour)

	tests := []struct {
		name       string
		id         int
		newEndDate time.Time
		setupMock  func(*mockSubscriptionRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "lỗi repo trả về lỗi gốc",
			id:         1,
			newEndDate: futureDate,
			setupMock: func(m *mockSubscriptionRepo) {
				m.RenewFn = func(_ int, _ time.Time) error {
					return errors.New("db renew error")
				}
			},
			wantErrMsg: "db renew error",
		},
		{
			name:       "gia hạn thành công",
			id:         5,
			newEndDate: futureDate,
			wantNoErr:  true,
		},
		{
			name:       "repo nhận đúng id và ngày kết thúc mới",
			id:         7,
			newEndDate: futureDate,
			setupMock: func(m *mockSubscriptionRepo) {
				m.RenewFn = func(id int, newEndDate time.Time) error {
					if id != 7 {
						return errors.New("wrong id passed to repo")
					}
					if !newEndDate.Equal(futureDate) {
						return errors.New("wrong end date passed to repo")
					}
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
			err := uc.RenewSubscription(tt.id, tt.newEndDate)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}

// ─── UpgradeSubscription ──────────────────────────────────────────────────────

func TestUpgradeSubscription(t *testing.T) {
	futureDate := time.Now().UTC().Add(60 * 24 * time.Hour)

	tests := []struct {
		name         string
		id           int
		newPackageID int
		newEndDate   time.Time
		setupMock    func(*mockSubscriptionRepo)
		wantErrMsg   string
		wantNoErr    bool
	}{
		{
			name:         "lỗi repo trả về lỗi gốc",
			id:           1,
			newPackageID: 2,
			newEndDate:   futureDate,
			setupMock: func(m *mockSubscriptionRepo) {
				m.UpgradeFn = func(_, _ int, _ time.Time) error {
					return errors.New("db upgrade error")
				}
			},
			wantErrMsg: "db upgrade error",
		},
		{
			name:         "nâng cấp gói thành công",
			id:           3,
			newPackageID: 5,
			newEndDate:   futureDate,
			wantNoErr:    true,
		},
		{
			name:         "repo nhận đúng id, packageID và ngày kết thúc mới",
			id:           10,
			newPackageID: 3,
			newEndDate:   futureDate,
			setupMock: func(m *mockSubscriptionRepo) {
				m.UpgradeFn = func(id, newPackageID int, newEndDate time.Time) error {
					if id != 10 {
						return errors.New("wrong id passed to repo")
					}
					if newPackageID != 3 {
						return errors.New("wrong packageID passed to repo")
					}
					if !newEndDate.Equal(futureDate) {
						return errors.New("wrong end date passed to repo")
					}
					return nil
				}
			},
			wantNoErr: true,
		},
		{
			name:         "nâng cấp với gói khác nhau cùng một subscription",
			id:           2,
			newPackageID: 10,
			newEndDate:   futureDate,
			setupMock: func(m *mockSubscriptionRepo) {
				calledWith := struct{ id, pkg int }{}
				m.UpgradeFn = func(id, packageID int, _ time.Time) error {
					calledWith.id = id
					calledWith.pkg = packageID
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
			err := uc.UpgradeSubscription(tt.id, tt.newPackageID, tt.newEndDate)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
