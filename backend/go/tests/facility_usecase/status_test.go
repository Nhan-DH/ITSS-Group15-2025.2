package facility_test

import (
	"errors"
	"testing"
)

// ─── UpdateFacilityStatus ─────────────────────────────────────────────────────

func TestUpdateFacilityStatus(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		status     string
		setupMock  func(*mockFacilityRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			id:         0,
			status:     "Operating",
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			id:         -1,
			status:     "Operating",
			wantErrMsg: "invalid id",
		},
		{
			name:       "status rỗng trả về lỗi enum",
			id:         1,
			status:     "",
			wantErrMsg: "status must be 'Operating' or 'Maintenance'",
		},
		{
			name:       "status không hợp lệ trả về lỗi enum",
			id:         1,
			status:     "Active",
			wantErrMsg: "status must be 'Operating' or 'Maintenance'",
		},
		{
			name:       "status viết thường trả về lỗi enum",
			id:         1,
			status:     "operating",
			wantErrMsg: "status must be 'Operating' or 'Maintenance'",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   3, status: "Operating",
			setupMock: func(m *mockFacilityRepo) {
				m.UpdateStatusFn = func(_ int, _ string) error {
					return errors.New("db status error")
				}
			},
			wantErrMsg: "db status error",
		},
		{
			name:      "cập nhật status thành 'Operating' thành công",
			id:        5,
			status:    "Operating",
			wantNoErr: true,
		},
		{
			name:      "cập nhật status thành 'Maintenance' thành công",
			id:        6,
			status:    "Maintenance",
			wantNoErr: true,
		},
		{
			name: "repo nhận đúng id và status",
			id:   9, status: "Maintenance",
			setupMock: func(m *mockFacilityRepo) {
				m.UpdateStatusFn = func(id int, status string) error {
					if id != 9 {
						return errors.New("wrong id passed to repo")
					}
					if status != "Maintenance" {
						return errors.New("wrong status passed to repo")
					}
					return nil
				}
			},
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFacilityRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateFacilityStatus(tt.id, tt.status)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
