package postgresql

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func NewDB() *sql.DB {
	connStr := "user=postgres dbname=gymdb sslmode=disable password=yourpassword host=localhost"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	return db
}
