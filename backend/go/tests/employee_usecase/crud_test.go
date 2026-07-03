package employee_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateEmployee ───────────────────────────────────────────────────────────

func TestCreateEmployee(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockEmployeeRepo{
			CreateFn: func(_ *entity.Employee) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateEmployee(makeEmployee(0, 1))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo employee thành công", func(t *testing.T) {
		repo := &mockEmployeeRepo{}
		err := newTestUsecase(repo).CreateEmployee(makeEmployee(0, 2))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, employee pointer được cập nhật", func(t *testing.T) {
		repo := &mockEmployeeRepo{
			CreateFn: func(e *entity.Employee) error {
				e.ID = 55
				return nil
			},
		}
		emp := makeEmployee(0, 3)
		err := newTestUsecase(repo).CreateEmployee(emp)
		assertNoError(t, err)
		if emp.ID != 55 {
			t.Errorf("expected emp.ID = 55 after create, got %d", emp.ID)
		}
	})
}

// ─── GetEmployeeByID ──────────────────────────────────────────────────────────

func TestGetEmployeeByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockEmployeeRepo)
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
			id:         -3,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetByIDFn = func(_ int) (*entity.Employee, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy employee thành công",
			id:   8,
			setupMock: func(m *mockEmployeeRepo) {
				m.GetByIDFn = func(id int) (*entity.Employee, error) {
					return makeEmployee(id, 1), nil
				}
			},
			wantID: 8,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEmployeeRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetEmployeeByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil employee")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdateEmployee ───────────────────────────────────────────────────────────

func TestUpdateEmployee(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.Employee
		setupMock  func(*mockEmployeeRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "ID = 0 trả về invalid id",
			input:      makeEmployee(0, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:       "ID âm trả về invalid id",
			input:      makeEmployee(-1, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeEmployee(3, 1),
			setupMock: func(m *mockEmployeeRepo) {
				m.UpdateFn = func(_ *entity.Employee) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật employee thành công",
			input:     makeEmployee(6, 2),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEmployeeRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateEmployee(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	t.Run("employee pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockEmployeeRepo{
			UpdateFn: func(e *entity.Employee) error {
				e.Position = "Manager"
				e.Salary = 10000000
				return nil
			},
		}
		emp := makeEmployee(4, 1)
		err := newTestUsecase(repo).UpdateEmployee(emp)
		assertNoError(t, err)
		if emp.Position != "Manager" {
			t.Errorf("expected Position = 'Manager', got %q", emp.Position)
		}
		if emp.Salary != 10000000 {
			t.Errorf("expected Salary = 10000000, got %v", emp.Salary)
		}
	})
}

// ─── DeleteEmployee ───────────────────────────────────────────────────────────

func TestDeleteEmployee(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockEmployeeRepo)
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
			id:         -1,
			wantErrMsg: "invalid id",
		},
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   3,
			setupMock: func(m *mockEmployeeRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá employee thành công",
			id:        7,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockEmployeeRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteEmployee(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
