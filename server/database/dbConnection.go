// Declaring the Database Package //
package database

// Importing the required modules //
import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Declaring global variables for DB Collections //
var (
	TaskCollection *mongo.Collection
	UserCollection *mongo.Collection
)

// = = = Defining the function for DB Connection = = = //
func ConnectDB() {
	// Loading the .env file variables
	MONGO_URI := os.Getenv("MONGO_URI")
	if MONGO_URI == "" {
		log.Fatal("MONGO_URI not set in .env file")
	}

	// Set up a MongoDB client and connect to it
	clientOptions := options.Client().ApplyURI(MONGO_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Server connected to DB !!")

	// Create collections in our DB
	TaskCollection = client.Database("TaskAppMFRG").Collection("tasks")
	UserCollection = client.Database("TaskAppMFRG").Collection("users")
}
