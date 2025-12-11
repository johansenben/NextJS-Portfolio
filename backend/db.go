package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	connStr := "host=db port=" + os.Getenv("POSTGRES_PORT") + " user=" + os.Getenv("POSTGRES_USER") + " password="+ os.Getenv("POSTGRES_PASSWORD") +" dbname=" + os.Getenv("POSTGRES_DB") + " sslmode=disable"

	DB, err := sql.Open("postgres", connStr)
	if err != nil {
			fmt.Println(err)
	} else {
		fmt.Println("Database connected")
		if _, err := DB.Exec("CREATE TABLE checkers (id SERIAL PRIMARY KEY)"); err != nil {
			fmt.Print("db error")
			fmt.Println(err)
		}
	}
	defer DB.Close()
}