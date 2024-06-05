// Declaring the Main Package
package main

// Importing the required modules
import (
	"fmt"
	"log"
	"github.com/gofiber/fiber/v2"
)

// Declaring Main method (compulsory)
func main() {
	fmt.Println("Hello World ! This is a Tasks App built using Go Lang")

	// Creating a new Fiber app
	app := fiber.New()

	// Defining the routes of our app
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{"msg": "All Fine !!"})
	})

	// Listening the App server at port 4000
	log.Fatal(app.Listen(":4000"))
}