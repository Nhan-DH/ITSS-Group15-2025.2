package role_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/role_usecase"
)

func newTestUsecase(repo *mockRoleRepo) role_usecase.RoleUsecase {
	return role_usecase.NewRoleUsecase(repo)
}

func makeRole(id int) *entity.Role {
	return &entity.Role{
		ID:       id,
		RoleName: "Trainer",
	}
}

func assertNoError(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Errorf("expected no error, got: %v", err)
	}
}

func assertErrorMsg(t *testing.T, got error, wantMsg string) {
	t.Helper()
	if got == nil {
		t.Errorf("expected error %q, got nil", wantMsg)
		return
	}
	if got.Error() != wantMsg {
		t.Errorf("expected error %q, got %q", wantMsg, got.Error())
	}
}

func assertErrorIs(t *testing.T, got, want error) {
	t.Helper()
	if got == nil {
		t.Errorf("expected error %v, got nil", want)
		return
	}
	if !errors.Is(got, want) {
		t.Errorf("expected errors.Is(%v), got: %v", want, got)
	}
}
