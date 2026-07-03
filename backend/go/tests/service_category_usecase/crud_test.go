package service_category_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateServiceCategory ────────────────────────────────────────────────────

func TestCreateServiceCategory(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockServiceCategoryRepo{
			CreateFn: func(_ *entity.ServiceCategory) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateServiceCategory(makeCategory(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo service category thành công", func(t *testing.T) {
		repo := &mockServiceCategoryRepo{}
		err := newTestUsecase(repo).CreateServiceCategory(makeCategory(1))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, pointer được cập nhật", func(t *testing.T) {
		repo := &mockServiceCategoryRepo{
			CreateFn: func(sc *entity.ServiceCategory) error {
				sc.ID = 55
				return nil
			},
		}
		sc := makeCategory(0)
		err := newTestUsecase(repo).CreateServiceCategory(sc)
		assertNoError(t, err)
		if sc.ID != 55 {
			t.Errorf("expected ID = 55 after create, got %d", sc.ID)
		}
	})
}

// ─── GetServiceCategoryByID ───────────────────────────────────────────────────

func TestGetServiceCategoryByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockServiceCategoryRepo)
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
			setupMock: func(m *mockServiceCategoryRepo) {
				m.GetByIDFn = func(_ int) (*entity.ServiceCategory, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy service category thành công",
			id:   4,
			setupMock: func(m *mockServiceCategoryRepo) {
				m.GetByIDFn = func(id int) (*entity.ServiceCategory, error) {
					return makeCategory(id), nil
				}
			},
			wantID: 4,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockServiceCategoryRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetServiceCategoryByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil service category")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── GetAllServiceCategories ──────────────────────────────────────────────────

func TestGetAllServiceCategories(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockServiceCategoryRepo{
			GetAllFn: func() ([]*entity.ServiceCategory, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllServiceCategories()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có service category", func(t *testing.T) {
		repo := &mockServiceCategoryRepo{
			GetAllFn: func() ([]*entity.ServiceCategory, error) {
				return []*entity.ServiceCategory{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllServiceCategories()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng service category", func(t *testing.T) {
		categories := []*entity.ServiceCategory{makeCategory(1), makeCategory(2), makeCategory(3)}
		repo := &mockServiceCategoryRepo{
			GetAllFn: func() ([]*entity.ServiceCategory, error) {
				return categories, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllServiceCategories()
		assertNoError(t, err)
		if len(result) != 3 {
			t.Errorf("expected 3 categories, got %d", len(result))
		}
	})
}

// ─── UpdateServiceCategory ────────────────────────────────────────────────────

func TestUpdateServiceCategory(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.ServiceCategory
		setupMock  func(*mockServiceCategoryRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "id = 0 trả về invalid id",
			input:      makeCategory(0),
			wantErrMsg: "invalid id",
		},
		{
			name:       "id âm trả về invalid id",
			input:      makeCategory(-1),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeCategory(3),
			setupMock: func(m *mockServiceCategoryRepo) {
				m.UpdateFn = func(_ *entity.ServiceCategory) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật service category thành công",
			input:     makeCategory(8),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockServiceCategoryRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateServiceCategory(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockServiceCategoryRepo{
			UpdateFn: func(sc *entity.ServiceCategory) error {
				sc.CategoryName = "Pilates"
				sc.BenefitsDescription = "Core strength"
				return nil
			},
		}
		sc := makeCategory(6)
		err := newTestUsecase(repo).UpdateServiceCategory(sc)
		assertNoError(t, err)
		if sc.CategoryName != "Pilates" {
			t.Errorf("expected CategoryName = 'Pilates', got %q", sc.CategoryName)
		}
		if sc.BenefitsDescription != "Core strength" {
			t.Errorf("expected BenefitsDescription = 'Core strength', got %q", sc.BenefitsDescription)
		}
	})
}

// ─── DeleteServiceCategory ────────────────────────────────────────────────────

func TestDeleteServiceCategory(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockServiceCategoryRepo)
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
			setupMock: func(m *mockServiceCategoryRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá service category thành công",
			id:        9,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockServiceCategoryRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteServiceCategory(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
