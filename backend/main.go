package main

import (
	"os"
	"portfolio/checkers"

	"github.com/gin-gonic/gin"
)

func main() {
		InitDB()

    app := gin.Default()

    checkers.CheckersRoute(app)

    app.Run(":" + os.Getenv("GO_PORT")) // listen and serve on 0.0.0.0:8080
}