// Declaring the Main Package
package main

// Importing the required modules
import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//\\ Defining a struct to store our TODO Tasks //\\
type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
}

// Declaring global variables
var collection *mongo.Collection

//\\ Declaring Main method (compulsory) //\\
func main() {
	// Loading the .env files
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	// Get the MongoURL value for the App to connect //
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

	// close the connection if its successfull
	defer client.Disconnect(context.Background())

	// Check the connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Server connected to DB !!")

	// Create a collection in our DB 
	collection = client.Database("TaskAppMFRG").Collection("tasks")
	
	// Creating a new Fiber app //
	app := fiber.New()
	// Setting up the Cors
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("CLIENT_ORIGIN"),
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	// Defining different routes of the app //
	app.Get("/api/tasks/getTasks", getTasks)
	app.Post("/api/tasks/createTask", createTask)
	app.Patch("/api/tasks/updateTask/:id", updateTask)
	app.Delete("/api/tasks/deleteTask/:id", deleteTask)

	// Get the PORT value for the App //
	PORT := os.Getenv("PORT")
	// set a default port if not specified explicitely
	if PORT == "" {
		PORT = "3000" 
	}
	// Start the Fiber app at given Port
	fmt.Println("Server is up & running...")
	log.Fatal(app.Listen("localhost:" + PORT))
}



// ===================================================================== //
// ========= Creating the controller function for the routes =========== //
// ===================================================================== //


//\\ Controller function for getting all the tasks //\\ 
func getTasks(res *fiber.Ctx) error {
	// create a array of Tasks of type TODO struct 
	var tasks []Todo

	// Fetch all the tasks without any filtering
	cursor, err := collection.Find(context.Background(), bson.M{})
	// if the fetching of tasks is not done then return error
	if err != nil {
		return err
	}

	// Close the cursor connection when work is done
	// defer will postpone the execution of this line untill the surrounding function(getTasks()) call is executed
	defer cursor.Close(context.Background())

	// if all tasks fetched then iterate over them
	for cursor.Next(context.Background()){
		var task Todo
		if err := cursor.Decode(&task); err != nil {
			return err
		}
		// append the task obtained from cursor into TODO ( tasks[] )
		tasks = append(tasks, task)
	}
	// Send the fetched tasks as a response
	return res.Status(200).JSON(tasks)
}


//\\ Controller function for Creating a task //\\
func createTask(res *fiber.Ctx) error{
	// create a new deafult task => { id: 0, completed: false, body: "" }
	task := new(Todo)

	// Parse the body of the task created by the user and if any error then show it
	if err := res.BodyParser(task); err != nil{
		return err
	}

	// check if the Body of Task is empty in BODY
	if task.Body == ""{
		return res.Status(400).JSON(fiber.Map{"error": "Task must have a non-empty Body."})
	}

	// If everything is fine then insert the task into DB
	insertedTask, err := collection.InsertOne(context.Background(), task)
	if err != nil {
		return err
	}

	// update the task id everytime a new task is created
	task.ID = insertedTask.InsertedID.(primitive.ObjectID)

	// if everything is fine then return the created task as response
	return res.Status(201).JSON(task)
}


//\\ Controller function for updating a task //\\
func updateTask(res *fiber.Ctx) error{
	// grab the task ID from the params 
	paramID := res.Params("id")
	// which will be of type String so convert to suitable form(primitive)
	taskID, err := primitive.ObjectIDFromHex(paramID)
	// if any error occurs then return it
	if err != nil {
		return res.Status(400).JSON(fiber.Map{"error": "Invalid task selected."})
	}

	// creating a filter for updation using BSON.M{}
	filter := bson.M{"_id":taskID}
	// update the "completed" field everytime a Task is udpated
	updation := bson.M{"$set":bson.M{"completed":true}}
	
	// updating a Task with given filter and updation content
	_,err = collection.UpdateOne(context.Background(), filter, updation)
	if err != nil{
		return err
	}

	// if everything is fine then send a success response
	return res.Status(200).JSON(fiber.Map{"success": "Task updated."})

}


//\\ Controller function for deleting a task //\\
func deleteTask(res *fiber.Ctx) error{
	// grab the task ID from the params 
	paramID := res.Params("id")
	// which will be of type String so convert to suitable form(primitive)
	taskID, err := primitive.ObjectIDFromHex(paramID)
	// if any error occurs then return it
	if err != nil {
		return res.Status(400).JSON(fiber.Map{"error": "Invalid task selected."})
	}

	// creating a filter for deletion using BSON.M{}
	filter := bson.M{"_id":taskID}

	// Deleting a selected task over a filter
	_, err = collection.DeleteOne(context.Background(), filter)
	if err != nil{
		return err
	}

	// if everything is fine then send a success response
	return res.Status(200).JSON(fiber.Map{"success": "Task deleted."})
}