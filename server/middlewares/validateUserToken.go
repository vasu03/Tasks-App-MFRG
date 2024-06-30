// Declaring the middlewares package //
package middlewares

// Importing the required modules //
import (
	"os"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v2"
	"github.com/joho/godotenv"
)

// Getting the secret for JWT
var jwtSecret []byte
func init() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	// Get JWT_SECRET from environment
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
}

// Handler func to validate the user from the JWT token //
func ValidUser() fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey:   jwtSecret,
		TokenLookup:  "header:Authorization",
		AuthScheme:   "Bearer",
		ErrorHandler: jwtErrorHandler,
	})
}

// Function to handle the error occured while authenticating the JWT token //
func jwtErrorHandler(c *fiber.Ctx, err error) error {
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized access", 
			"error" : err,
		})
	}
	return nil
}
