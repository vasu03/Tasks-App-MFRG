// Declaring the Routes package //
package routes

// Importing required modules //
import (
	"github.com/gofiber/fiber/v2"
	"github.com/vasu03/Tasks-App-MFRG/server/controllers"
)

// Defining a function to set up user-related routes //
func SetupUserRoutes(app *fiber.App) {
	app.Post("/api/users/signup", controllers.Signup)
	app.Post("/api/users/login", controllers.Login)
	app.Post("/api/users/logout", controllers.Logout)
}
