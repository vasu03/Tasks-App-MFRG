// Declaring the Controllers package
package controllers

// Importing the required modules //
import (
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/vasu03/Tasks-App-MFRG/server/database"
	"github.com/vasu03/Tasks-App-MFRG/server/models"
)


// Helper function to get user ID from JWT token //
func getUserIDFromToken(c *fiber.Ctx) (primitive.ObjectID, error) {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	fmt.Println("userID", userID)
	fmt.Println("userToken", userToken)
	return userID, err
}


// = = = Defining a controller func for Getting all Tasks = = = //
func GetTasks(c *fiber.Ctx) error {
	// create a array of Tasks of type TODO struct defined in our DB model
	var tasks []models.Todo

	// Get the user ID from the token
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get user ID from token"})
	}

	// Fetch all the tasks for the specific user
	filter := bson.M{"userId": userID}
	cursor, err := database.TaskCollection.Find(context.Background(), filter)
	// if the fetching of tasks is not done then return error
	if err != nil {
		return err
	}

	// Close the cursor connection when work is done
	// defer will postpone the execution of this line until the surrounding function(getTasks()) call is executed
	defer cursor.Close(context.Background())

	// if all tasks fetched then iterate over them
	for cursor.Next(context.Background()) {
		var task models.Todo
		if err := cursor.Decode(&task); err != nil {
			return err
		}
		// append the task obtained from cursor into TODO (tasks[])
		tasks = append(tasks, task)
	}
	// Send the fetched tasks as a response
	return c.Status(200).JSON(tasks)
}


// = = = Defining a controller func for Creating new Tasks = = = //
func CreateTask(c *fiber.Ctx) error {
	// create a new default task => {id: 0, completed: false, body: ""}
	task := new(models.Todo)

	// Parse the body of the task created by the user and if any error then show it
	if err := c.BodyParser(task); err != nil {
		return err
	}

	// check if the Body of Task is empty in BODY
	if task.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Task must have a non-empty Body."})
	}

	// Get the user ID from the token
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get user ID from token"})
	}

	// Assign the user ID to the task
	task.UserID = userID

	// If everything is fine then insert the task into DB
	insertedTask, err := database.TaskCollection.InsertOne(context.Background(), task)
	if err != nil {
		return err
	}

	// update the task id every time a new task is created
	task.ID = insertedTask.InsertedID.(primitive.ObjectID)

	// if everything is fine then return the created task as response
	return c.Status(201).JSON(task)
}

// = = = Defining a controller func for Updating existing Tasks = = = //
func UpdateTask(c *fiber.Ctx) error {
	// grab the task ID from the params
	paramID := c.Params("id")
	// which will be of type String so convert to suitable form(primitive)
	taskID, err := primitive.ObjectIDFromHex(paramID)
	// if any error occurs then return it
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid task selected."})
	}

	// Get the user ID from the token
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get user ID from token"})
	}

	// creating a filter for updation using BSON.M{}
	filter := bson.M{"_id": taskID, "userId": userID}
	// update the "completed" field every time a Task is updated
	updation := bson.M{"$set": bson.M{"completed": true}}

	// updating a Task with given filter and updation content
	_, err = database.TaskCollection.UpdateOne(context.Background(), filter, updation)
	if err != nil {
		return err
	}

	// if everything is fine then send a success response
	return c.Status(200).JSON(fiber.Map{"success": "Task updated."})
}

// = = = Defining a controller func for Deleting existing Tasks = = = //
func DeleteTask(c *fiber.Ctx) error {
	// grab the task ID from the params
	paramID := c.Params("id")
	// which will be of type String so convert to suitable form(primitive)
	taskID, err := primitive.ObjectIDFromHex(paramID)
	// if any error occurs then return it
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid task selected."})
	}

	// Get the user ID from the token
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get user ID from token"})
	}

	// creating a filter for deletion using BSON.M{}
	filter := bson.M{"_id": taskID, "userId": userID}

	// Deleting a selected task over a filter
	_, err = database.TaskCollection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}

	// if everything is fine then send a success response
	return c.Status(200).JSON(fiber.Map{"success": "Task deleted."})
}
