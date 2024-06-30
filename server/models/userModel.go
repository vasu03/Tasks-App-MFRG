// Declaring the Models package //
package models

// Importing required modules //
import "go.mongodb.org/mongo-driver/bson/primitive"

// Defining a struct to store user information //
type User struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username"`
	Email    string             `json:"email"`
	Password string             `json:"password"`
}
