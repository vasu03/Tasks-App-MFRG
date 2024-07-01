// Declaring the Controllers package
package controllers

// Importing the required modules
import (
	"context"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"github.com/vasu03/Tasks-App-MFRG/server/database"
	"github.com/vasu03/Tasks-App-MFRG/server/models"
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

// HashPassword hashes the given password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash checks if the given password matches the hashed password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// = = = User Signup handler for user registration = = = //
func Signup(c *fiber.Ctx) error {
	// Declare a default user of type struct User as per model
	user := new(models.User)

	// Parse the request body to the user model
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Check if the user already exists then show the error
	filter := bson.M{"email": user.Email}
	existingUser := new(models.User)
	// find that user via a filter
	err := database.UserCollection.FindOne(context.Background(), filter).Decode(existingUser)
	if err == nil {
		return c.Status(400).JSON(fiber.Map{"error": "User already exists"})
	} else if err != mongo.ErrNoDocuments {
		return c.Status(500).JSON(fiber.Map{"error": "Error checking existing user"})
	}

	// Hash the user's password
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error hashing password"})
	}
	// set the user password as hashedPassword
	user.Password = hashedPassword

	// Insert the new user into the database
	user.ID = primitive.NewObjectID()
	_, err = database.UserCollection.InsertOne(context.Background(), user)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error creating user"})
	}

	// Create JWT token for authentication
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID.Hex(),
		"exp":    time.Now().Add(time.Hour * 1).Unix(),
	})

	// generate a token string using the secret
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error creating JWT token"})
	}

	// Set the generated token as a cookie
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  time.Now().Add(1 * time.Hour),
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
		Path:     "/",
	})

	// If everything goes well then send the user as response without password
	userResponse := fiber.Map{
		"id":    user.ID,
		"username":  user.Username,
	}

	return c.Status(201).JSON(userResponse)
}

// = = = User Login handler for user authentication = = = //
func Login(c *fiber.Ctx) error {
	// Declare a default data as per type struct User
	loginData := new(models.User)

	// Parse the request body to the loginData model
	if err := c.BodyParser(loginData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Find the user by email from DB
	filter := bson.M{"email": loginData.Email}
	user := new(models.User)
	// finding that user with a filter
	err := database.UserCollection.FindOne(context.Background(), filter).Decode(user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(404).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Error finding user"})
	}

	// Check the password with original one
	if !CheckPasswordHash(loginData.Password, user.Password) {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid password"})
	}

	// Create JWT token for authentication
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID.Hex(),
		"exp":    time.Now().Add(time.Hour * 1).Unix(),
	})

	// generate a token string using the secret
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error creating JWT token"})
	}

	// Set the generated token as a cookie
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  time.Now().Add(1 * time.Hour),
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
		Path:     "/",
	})

	// If everything is fine then send the logged user as response without password
	userResponse := fiber.Map{
		"id":    user.ID,
		"username":  user.Username,
	}

	return c.Status(200).JSON(userResponse)
}

// = = = User Logout handler for user logout = = = //
func Logout(c *fiber.Ctx) error {
	// Clear the JWT token cookie
	cookie := new(fiber.Cookie)
	cookie.Name = "token"
	cookie.Path = "/"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-1 * time.Hour)
	c.Cookie(cookie)

	// If everything goes well then send a success message
	return c.Status(200).JSON(fiber.Map{"message": "Logout successful"})
}