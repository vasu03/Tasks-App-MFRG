// Declaring the Routes package //
package routes

// Importing the required modules //
import (
	"github.com/gofiber/fiber/v2"
	"github.com/vasu03/Tasks-App-MFRG/server/controllers"
	"github.com/vasu03/Tasks-App-MFRG/server/middlewares"
)

// function defining the task routes with custom middlewares to secure them //
func SetupTaskRoutes(app *fiber.App) {
	// Use the custom middlewares with all routes
	app.Use("/api/tasks/*", middlewares.JWTFromCookie())
	// defining the secured routes
	app.Get("/api/tasks/getTasks", middlewares.ValidUser(), controllers.GetTasks)
	app.Post("/api/tasks/createTask", middlewares.ValidUser(), controllers.CreateTask)
	app.Patch("/api/tasks/updateTask/:id", middlewares.ValidUser(), controllers.UpdateTask)
	app.Delete("/api/tasks/deleteTask/:id", middlewares.ValidUser(), controllers.DeleteTask)
}
