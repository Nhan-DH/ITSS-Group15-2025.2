package member_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── CreateMember ─────────────────────────────────────────────────────────────

func TestCreateMember(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockMemberRepo{
			CreateFn: func(_ *entity.Member) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateMember(makeMember(0, 1))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo member thành công", func(t *testing.T) {
		repo := &mockMemberRepo{}
		err := newTestUsecase(repo).CreateMember(makeMember(0, 2))
		assertNoError(t, err)
	})

	t.Run("repo gán ID sau khi tạo, member pointer được cập nhật", func(t *testing.T) {
		repo := &mockMemberRepo{
			CreateFn: func(m *entity.Member) error {
				m.ID = 55
				return nil
			},
		}
		member := makeMember(0, 3)
		err := newTestUsecase(repo).CreateMember(member)
		assertNoError(t, err)
		if member.ID != 55 {
			t.Errorf("expected member.ID = 55 after create, got %d", member.ID)
		}
	})
}

// ─── GetMemberByID ────────────────────────────────────────────────────────────

func TestGetMemberByID(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockMemberRepo)
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
			setupMock: func(m *mockMemberRepo) {
				m.GetByIDFn = func(_ int) (*entity.Member, error) {
					return nil, errors.New("not found")
				}
			},
			wantErrMsg: "not found",
		},
		{
			name: "lấy member thành công",
			id:   7,
			setupMock: func(m *mockMemberRepo) {
				m.GetByIDFn = func(id int) (*entity.Member, error) {
					return makeMember(id, 10), nil
				}
			},
			wantID: 7,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockMemberRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			result, err := newTestUsecase(repo).GetMemberByID(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
				if result != nil {
					t.Errorf("expected nil result on error, got %+v", result)
				}
			} else {
				assertNoError(t, err)
				if result == nil {
					t.Fatal("expected non-nil member")
				}
				if result.ID != tt.wantID {
					t.Errorf("ID: got %d, want %d", result.ID, tt.wantID)
				}
			}
		})
	}
}

// ─── UpdateMember ─────────────────────────────────────────────────────────────

func TestUpdateMember(t *testing.T) {
	tests := []struct {
		name       string
		input      *entity.Member
		setupMock  func(*mockMemberRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name:       "ID = 0 trả về invalid id",
			input:      makeMember(0, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:       "ID âm trả về invalid id",
			input:      makeMember(-2, 1),
			wantErrMsg: "invalid id",
		},
		{
			name:  "lỗi repo trả về lỗi gốc",
			input: makeMember(5, 1),
			setupMock: func(m *mockMemberRepo) {
				m.UpdateFn = func(_ *entity.Member) error {
					return errors.New("db update error")
				}
			},
			wantErrMsg: "db update error",
		},
		{
			name:      "cập nhật member thành công",
			input:     makeMember(8, 2),
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockMemberRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateMember(tt.input)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}

	// Kiểm tra riêng: member pointer được cập nhật sau khi Update
	t.Run("member pointer phản ánh giá trị từ repo sau update", func(t *testing.T) {
		repo := &mockMemberRepo{
			UpdateFn: func(m *entity.Member) error {
				m.FullName = "Updated Name"
				return nil
			},
		}
		member := makeMember(3, 1)
		err := newTestUsecase(repo).UpdateMember(member)
		assertNoError(t, err)
		if member.FullName != "Updated Name" {
			t.Errorf("expected member.FullName = 'Updated Name', got %q", member.FullName)
		}
	})
}

// ─── UpdateMemberStatus ───────────────────────────────────────────────────────

func TestUpdateMemberStatus(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		isActive   bool
		setupMock  func(*mockMemberRepo)
		wantErrMsg string
		wantNoErr  bool
	}{
		{
			name: "lỗi repo trả về lỗi gốc",
			id:   1, isActive: true,
			setupMock: func(m *mockMemberRepo) {
				m.UpdateStatusFn = func(_ int, _ bool) error {
					return errors.New("db status error")
				}
			},
			wantErrMsg: "db status error",
		},
		{
			name: "kích hoạt member thành công",
			id:   3, isActive: true,
			wantNoErr: true,
		},
		{
			name: "vô hiệu hoá member thành công",
			id:   4, isActive: false,
			wantNoErr: true,
		},
		{
			name: "repo nhận đúng id và trạng thái",
			id:   9, isActive: false,
			setupMock: func(m *mockMemberRepo) {
				m.UpdateStatusFn = func(id int, isActive bool) error {
					if id != 9 {
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
			repo := &mockMemberRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).UpdateMemberStatus(tt.id, tt.isActive)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}

// ─── DeleteMember ─────────────────────────────────────────────────────────────

func TestDeleteMember(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		setupMock  func(*mockMemberRepo)
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
			id:   2,
			setupMock: func(m *mockMemberRepo) {
				m.DeleteFn = func(_ int) error {
					return errors.New("db delete error")
				}
			},
			wantErrMsg: "db delete error",
		},
		{
			name:      "xoá member thành công",
			id:        5,
			wantNoErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &mockMemberRepo{}
			if tt.setupMock != nil {
				tt.setupMock(repo)
			}
			err := newTestUsecase(repo).DeleteMember(tt.id)

			if tt.wantErrMsg != "" {
				assertErrorMsg(t, err, tt.wantErrMsg)
			} else if tt.wantNoErr {
				assertNoError(t, err)
			}
		})
	}
}
