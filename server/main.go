// Declaring the Main Package //
package main

// Importing the required modules //
import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/vasu03/Tasks-App-MFRG/server/database"
	"github.com/vasu03/Tasks-App-MFRG/server/middlewares"
	"github.com/vasu03/Tasks-App-MFRG/server/routes"
)

// = = = Declaring Main method (compulsory) = = = //
func main() {
	// Loading the .env files //
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	// Setting up the connection with the database //
	database.ConnectDB()

	// Creating a new Fiber app //
	app := fiber.New()

	// Setting up predefined middlewares //
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("CLIENT_ORIGIN"),
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Setting up the custom middlewares //
	app.Use(middlewares.Logger())

	// Setting up the custom routes for the app //
	routes.SetupTaskRoutes(app)
	routes.SetupUserRoutes(app)

	// Getting the port value for the app
	PORT := os.Getenv("PORT")
	// set a default port if not specified explicitely
	if PORT == "" {
		PORT = "3000"
	}
	// Start the Fiber app at given Port
	fmt.Println("Server is up & running...")
	log.Fatal(app.Listen("localhost:" + PORT))
}
