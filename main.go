// Declaring the Main Package
package main

// Importing the required modules
import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

// Defining a struct to store our TODO Tasks
type Todo struct{
	ID int `json:"id"`
	Completed bool `json:"completed"`
	Body string `json:"body"`
}

// Declaring Main method (compulsory)
func main() {
	// Creating a new Fiber app
	app := fiber.New()

	// Loading the .env files
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get the PORT value for the App
	PORT := os.Getenv("PORT")

	// Creating a TODOS array of type Todo{} struct
	todos := []Todo{}

// ============ Defining the routes of our app ============= //

	// GET route to get all the Tasks in TODO
	app.Get("/api/tasks/getTasks", func(c *fiber.Ctx) error{
		return c.Status(200).JSON(todos)
	})


	// POST route to create a Task in TODO
	app.Post("/api/tasks/createTask", func(c *fiber.Ctx) error{
		todo := &Todo{}			// { id: 0, completed: false, body: "" }  -> by default
		// if any error occurs while parsing the content from BODY then show it
		if err := c.BodyParser(todo); err != nil {
			return err
		}
		// give a error if the Body from the BODY is empty
		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{"error": "The body of a Task can't be empty..."})
		}
		// If no errors are there then id++
		todo.ID = len(todos) + 1
		todos  = append(todos, *todo)

		// If the TODO task created succesfully then send it as response
		return c.Status(201).JSON(todo)
	})


	// PUT route to update a Task in TODO
	app.Patch("/api/tasks/updateTask/:id", func(c *fiber.Ctx) error{
		id := c.Params("id")

		// loop over the Tasks stored in TODO and match the ID (conv to String) with the "id" obtained from params (already a string)
		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				todos[i].Completed = true			// make the completed field to be True whenever the update route is hit
				return c.Status(200).JSON(todos[i])	// return the updated todo
			}
		}
		// if no todo task matches with the demanded one then return error
		return c.Status(404).JSON(fiber.Map{"error": "The task is not found..."})
	})


	// DELETE route to delete a Task in TODO
	app.Delete("/api/tasks/deleteTask/:id", func(c *fiber.Ctx) error{
		id := c.Params("id")

		// loop over the Tasks stored in TODO and match the ID (conv to String) with the "id" obtained from params (already a string)
		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				// reassign the tasks upto index "i" (excluding i) and then from "i+1" till end (remaining intact ...) into todos-> so we excluded task at index "i"
				todos = append(todos[:i], todos[i+1:]...)	
				return c.Status(200).JSON(fiber.Map{"success": true})
			}
		}
		// if no todo task matches with the demanded one then return error
		return c.Status(404).JSON(fiber.Map{"error": "The task is not found..."})
	})

	// Listening the App server at given port
	log.Fatal(app.Listen(":" + PORT))
}