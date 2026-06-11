package auth_test

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/auth_usecase"
)

const testJWTSecret = "test-secret-for-unit-tests"

// newTestUsecase tạo usecase với JWT secret cố định, tránh phụ thuộc vào env thật.
func newTestUsecase(repo adapter.AuthRepository) auth_usecase.AuthUsecase {
	os.Setenv("JWT_SECRET", testJWTSecret)
	os.Setenv("JWT_ACCESS_TTL_MINUTES", "60")
	os.Setenv("JWT_REFRESH_TTL_HOURS", "168")
	return auth_usecase.NewAuthUsecase(repo)
}

// makeRefreshToken tạo JWT refresh token hợp lệ dùng trong test.
func makeRefreshToken(t *testing.T, accountID int, username, role string, expiry time.Time) string {
	t.Helper()
	claims := jwt.MapClaims{
		"sub":        strconv.Itoa(accountID),
		"username":   username,
		"role":       role,
		"token_type": "refresh",
		"iat":        time.Now().UTC().Unix(),
		"exp":        expiry.Unix(),
		"jti":        "test-jti-fixed",
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(testJWTSecret))
	if err != nil {
		t.Fatalf("makeRefreshToken: %v", err)
	}
	return token
}

// sha256Hex tính SHA-256 của chuỗi, giống hàm hashRefreshToken trong auth_usecase.
func sha256Hex(s string) string {
	sum := sha256.Sum256([]byte(s))
	return hex.EncodeToString(sum[:])
}

// makeAccount tạo entity.Account nhanh cho test.
func makeAccount(id int, username, password string, roleID int, isFirstLogin bool) *entity.Account {
	return &entity.Account{
		ID:           id,
		Username:     username,
		Password:     password,
		RoleID:       roleID,
		IsFirstLogin: isFirstLogin,
	}
}

// makeTokenRecord tạo adapter.RefreshTokenRecord cho test.
func makeTokenRecord(accountID int, revoked bool, expired bool) *adapter.RefreshTokenRecord {
	expiry := time.Now().UTC().Add(24 * time.Hour)
	if expired {
		expiry = time.Now().UTC().Add(-1 * time.Hour)
	}
	var revokedAt *time.Time
	if revoked {
		now := time.Now().UTC()
		revokedAt = &now
	}
	return &adapter.RefreshTokenRecord{
		AccountID: accountID,
		ExpiresAt: expiry,
		RevokedAt: revokedAt,
	}
}

// --- Assertion helpers ---

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

func assertErrorIs(t *testing.T, got error, want error) {
	t.Helper()
	if got == nil {
		t.Errorf("expected error %v, got nil", want)
		return
	}
	if !errors.Is(got, want) {
		t.Errorf("expected errors.Is(%v), got: %v", want, got)
	}
}
