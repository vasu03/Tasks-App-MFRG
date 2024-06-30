// Declaring the middlewares package //
package middlewares

// Importing the required modules //
import (
	"github.com/gofiber/fiber/v2"
)

// Handler func to extract the JWT token from browser cookies
func JWTFromCookie() fiber.Handler {
	return func(c *fiber.Ctx) error {
		//  get the token string from cookies
		cookie := c.Cookies("token")
		if cookie == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Unauthorized access, token not found",
			})
		}
		// Add the token to the Authorization header of browser
		c.Request().Header.Set("Authorization", "Bearer "+cookie)
		return c.Next()
	}
}
