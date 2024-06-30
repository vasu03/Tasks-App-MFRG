// Declaring the Models package //
package models

// Importing required modules //
import "go.mongodb.org/mongo-driver/bson/primitive"

// Defining a struct to store our TODO Tasks //
type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
	UserID    primitive.ObjectID `json:"userId" bson:"userId"`
}
