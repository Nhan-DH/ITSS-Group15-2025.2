package package_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreatePackage ────────────────────────────────────────────────────────────

func TestCreatePackage(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockPackageRepo{
			CreateFn: func(_ *entity.MembershipPackage) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreatePackage(makePkg(0, 1))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo package thành công", func(t *testing.T) {
		repo := &mockPackageRepo{}
		err := newTestUsecase(repo).CreatePackage(makePkg(0, 2))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, package pointer được cập nhật", func(t *testing.T) {
		repo := &mockPackageRepo{
			CreateFn: func(pkg *entity.MembershipPackage) error {
				pkg.ID = 77
				return nil
			},
		}
		pkg := makePkg(0, 1)
		err := newTestUsecase(repo).CreatePackage(pkg)
		assertNoError(t, err)
		if pkg.ID != 77 {
			t.Errorf("expected pkg.ID = 77 after create, got %d", pkg.ID)
		}
	})
}

// ─── GetPackageByID ───────────────────────────────────────────────────────────

func TestGetPackageByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockPackageRepo)
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
			setupMock: func(m *mockPackageRepo) {
				m.GetByIDFn = func(_ int) (*entity.MembershipPackage, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy package thành công",
			id:   6,
			setupMock: func(m *mockPackageRepo) {
				m.GetByIDFn = func(id int) (*entity.MembershipPackage, error) {
					return makePkg(id, 2), nil
				}
			},
			wantID: 6,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPackageRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetPackageByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil package")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdatePackage ────────────────────────────────────────────────────────────

func TestUpdatePackage(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.MembershipPackage
		setupMock  func(*mockPackageRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "ID = 0 trả về invalid id",
			input:      makePkg(0, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:       "ID âm trả về invalid id",
			input:      makePkg(-1, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makePkg(3, 1),
			setupMock: func(m *mockPackageRepo) {
				m.UpdateFn = func(_ *entity.MembershipPackage) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật package thành công",
			input:     makePkg(5, 2),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPackageRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdatePackage(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("package pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockPackageRepo{
			UpdateFn: func(pkg *entity.MembershipPackage) error {
				pkg.PackageName = "Updated Package"
				return nil
			},
		}
		pkg := makePkg(4, 1)
		err := newTestUsecase(repo).UpdatePackage(pkg)
		assertNoError(t, err)
		if pkg.PackageName != "Updated Package" {
			t.Errorf("expected PackageName = 'Updated Package', got %q", pkg.PackageName)
		}
	})
}

// ─── UpdatePackageStatus ──────────────────────────────────────────────────────

func TestUpdatePackageStatus(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		isActive   bool
		setupMock  func(*mockPackageRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			id:         0,
			isActive:   true,
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			id:         -2,
			isActive:   false,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1, isActive: true,
			setupMock: func(m *mockPackageRepo) {
				m.UpdateStatusFn = func(_ int, _ bool) error {
					return errors.New("db status error")
				}
			},
			wantErrMsg: "db status error",
		},
		{
			name: "kích hoạt package thành công",
			id:   3, isActive: true,
			wantNoErr: true,
		},
		{
			name: "vô hiệu hoá package thành công",
			id:   4, isActive: false,
			wantNoErr: true,
		},
		{
			name: "repo nhận đúng id và trạng thái",
			id:   8, isActive: false,
			setupMock: func(m *mockPackageRepo) {
				m.UpdateStatusFn = func(id int, isActive bool) error {
					if id != 8 {
						return errors.New("wrong id passed to repo")
					}
					if isActive {
						return errors.New("wrong isActive passed to repo")
					}
					return nil
				}
			},
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPackageRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdatePackageStatus(tt.id, tt.isActive)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}

// ─── DeletePackage ────────────────────────────────────────────────────────────

func TestDeletePackage(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockPackageRepo)
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
			id:         -4,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   2,
			setupMock: func(m *mockPackageRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá package thành công",
			id:        9,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockPackageRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeletePackage(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
