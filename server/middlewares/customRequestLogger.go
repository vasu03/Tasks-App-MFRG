// Declaring the middleware package //
package middlewares

// Importing the required modules //
import (
    "log"
    "time"

    "github.com/gofiber/fiber/v2"
)

// = = = Defining a func to Logg all incoming request to our server in Terminal = = = //
func Logger() fiber.Handler {
    return func(c *fiber.Ctx) error {
        // Start time of the request
		start := time.Now()
        // error occured in request (if any)
		err := c.Next()
		// Stop time of the request
        stop := time.Now()

		// print the details of request to Terminal
        log.Printf("[%s] [%s] [%s] [%d] [%s]\n", c.IP(), c.Method(), c.Path(), c.Response().StatusCode(), stop.Sub(start))

		// return if there is any error
        return err
    }
}
