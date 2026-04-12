// Go Seeder — tạo dữ liệu khởi tạo (Roles + tài khoản mặc định)
// Cách chạy: go run ./tools/seeder/main.go
//
// Script sẽ tự động:
//   1. Reset sequences
//   2. Tạo 4 Roles (OWNER, MANAGER, PT, MEMBER)
//   3. Tạo các tài khoản mặc định với bcrypt hash tự động
//
// Thêm tài khoản: chỉnh slice `accounts` bên dưới rồi chạy lại.

package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// ============================================================
// ✏️  CHỈNH SỬA TẠI ĐÂY ĐỂ THÊM/BỚT TÀI KHOẢN
// ============================================================
type AccountSeed struct {
	Username string
	Password string // plaintext — seeder tự hash
	RoleName string // OWNER | MANAGER | PT | MEMBER
}

var accounts = []AccountSeed{
	// {Username: "owner", Password: "Admin@123", RoleName: "OWNER"},
	// {Username: "manager01", Password: "Manager@123", RoleName: "MANAGER"},
	// {Username: "pt01", Password: "Trainer@123", RoleName: "PT"},
	// {Username: "member01", Password: "Member@123", RoleName: "MEMBER"},
	{Username: "pt01", Password: "Trainer@123", RoleName: "PT"},
}

// ============================================================

func main() {
	// Load .env file
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Warning: .env not found, using system env vars")
	}

	db := connectDB()
	defer db.Close()

	log.Println("🌱 Bắt đầu seed dữ liệu...")

	// Reset sequences
	resetSequences(db)

	// Seed Roles
	seedRoles(db)

	// Seed Accounts
	seedAccounts(db)

	log.Println("✅ Seed xong! Danh sách tài khoản:")
	printAccounts(db)
}

func connectDB() *sql.DB {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "gymdb")
	sslMode := getEnv("DB_SSLMODE", "disable")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbName, sslMode)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Lỗi kết nối DB:", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal("Không ping được DB:", err)
	}
	log.Println("✅ Kết nối DB thành công")
	return db
}

func resetSequences(db *sql.DB) {
	var roleCount, accountCount int
	db.QueryRow(`SELECT COUNT(*) FROM "Role"`).Scan(&roleCount)
	db.QueryRow(`SELECT COUNT(*) FROM "Account"`).Scan(&accountCount)

	if roleCount == 0 {
		db.Exec(`ALTER SEQUENCE "Role_id_seq" RESTART WITH 1`)
		log.Println("🔄 Reset Role sequence")
	}
	if accountCount == 0 {
		db.Exec(`ALTER SEQUENCE "Account_id_seq" RESTART WITH 1`)
		log.Println("🔄 Reset Account sequence")
	}
}

func seedRoles(db *sql.DB) {
	roles := []string{"OWNER", "MANAGER", "PT", "MEMBER"}
	for _, role := range roles {
		var exists bool
		db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "Role" WHERE UPPER(role_name)=$1)`, role).Scan(&exists)
		if exists {
			log.Printf("   Role %s đã tồn tại, bỏ qua", role)
			continue
		}
		if _, err := db.Exec(`INSERT INTO "Role" (role_name) VALUES ($1)`, role); err != nil {
			log.Fatalf("Lỗi tạo role %s: %v", role, err)
		}
		log.Printf("   ✅ Tạo Role: %s", role)
	}
}

func seedAccounts(db *sql.DB) {
	for _, acc := range accounts {
		// Kiểm tra tài khoản đã tồn tại chưa
		var exists bool
		db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "Account" WHERE username=$1)`, acc.Username).Scan(&exists)
		if exists {
			log.Printf("   Tài khoản '%s' đã tồn tại, bỏ qua", acc.Username)
			continue
		}

		// Lấy role_id
		var roleID int
		err := db.QueryRow(`SELECT id FROM "Role" WHERE UPPER(role_name)=$1`, acc.RoleName).Scan(&roleID)
		if err != nil {
			log.Fatalf("Không tìm thấy role '%s': %v", acc.RoleName, err)
		}

		// Hash password bằng bcrypt — KHÔNG cần viết hash thủ công
		hash, err := bcrypt.GenerateFromPassword([]byte(acc.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Lỗi hash password: %v", err)
		}

		// Insert
		if _, err := db.Exec(
			`INSERT INTO "Account" (username, password, role_id) VALUES ($1, $2, $3)`,
			acc.Username, string(hash), roleID,
		); err != nil {
			log.Fatalf("Lỗi tạo account '%s': %v", acc.Username, err)
		}

		log.Printf("   ✅ Tạo tài khoản: %-15s | role: %-10s | password: %s", acc.Username, acc.RoleName, acc.Password)
	}
}

func printAccounts(db *sql.DB) {
	rows, err := db.Query(`
		SELECT a.id, a.username, r.role_name
		FROM "Account" a
		JOIN "Role" r ON r.id = a.role_id
		ORDER BY a.id
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	fmt.Println("\n  ID | Username        | Role")
	fmt.Println("  ---|-----------------|----------")
	for rows.Next() {
		var id int
		var username, role string
		rows.Scan(&id, &username, &role)
		fmt.Printf("  %-3d| %-16s| %s\n", id, username, role)
	}
}

func getEnv(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}
