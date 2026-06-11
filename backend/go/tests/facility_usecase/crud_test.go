package facility_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateFacility ───────────────────────────────────────────────────────────

func TestCreateFacility(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockFacilityRepo{
			CreateFn: func(_ *entity.Facility) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateFacility(makeFacility(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo facility thành công", func(t *testing.T) {
		repo := &mockFacilityRepo{}
		err := newTestUsecase(repo).CreateFacility(makeFacility(0))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, facility pointer được cập nhật", func(t *testing.T) {
		repo := &mockFacilityRepo{
			CreateFn: func(f *entity.Facility) error {
				f.ID = 55
				return nil
			},
		}
		f := makeFacility(0)
		err := newTestUsecase(repo).CreateFacility(f)
		assertNoError(t, err)
		if f.ID != 55 {
			t.Errorf("expected f.ID = 55 after create, got %d", f.ID)
		}
	})
}

// ─── GetFacilityByID ──────────────────────────────────────────────────────────

func TestGetFacilityByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockFacilityRepo)
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
			id:         -1,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockFacilityRepo) {
				m.GetByIDFn = func(_ int) (*entity.Facility, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy facility thành công",
			id:   7,
			setupMock: func(m *mockFacilityRepo) {
				m.GetByIDFn = func(id int) (*entity.Facility, error) {
					return makeFacility(id), nil
				}
			},
			wantID: 7,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFacilityRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetFacilityByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil facility")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdateFacility ───────────────────────────────────────────────────────────

func TestUpdateFacility(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.Facility
		setupMock  func(*mockFacilityRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "ID = 0 trả về invalid id",
			input:      makeFacility(0),
			wantErrMsg: "invalid id",
		},
		{
			name:       "ID âm trả về invalid id",
			input:      makeFacility(-3),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeFacility(4),
			setupMock: func(m *mockFacilityRepo) {
				m.UpdateFn = func(_ *entity.Facility) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật facility thành công",
			input:     makeFacility(6),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFacilityRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateFacility(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("facility pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockFacilityRepo{
			UpdateFn: func(f *entity.Facility) error {
				f.FacilityName = "Updated Facility"
				return nil
			},
		}
		f := makeFacility(8)
		err := newTestUsecase(repo).UpdateFacility(f)
		assertNoError(t, err)
		if f.FacilityName != "Updated Facility" {
			t.Errorf("expected FacilityName = 'Updated Facility', got %q", f.FacilityName)
		}
	})
}

// ─── DeleteFacility ───────────────────────────────────────────────────────────

func TestDeleteFacility(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockFacilityRepo)
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
			id:         -5,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   2,
			setupMock: func(m *mockFacilityRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá facility thành công",
			id:        10,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockFacilityRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteFacility(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
