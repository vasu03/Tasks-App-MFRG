// Importing required modules
import { useState } from "react";
// Importing Chakra UI component
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
// Importing our custom components
import TodoItem from "./ToDoItem";

// /Creating the ToDo List component
const TodoList = () => {
    // State to handle the loading
	const [isLoading, setIsLoading] = useState(true);
	const todos = [
		{
			_id: 1,
			body: "Buy groceries",
			completed: true,
		},
		{
			_id: 2,
			body: "Walk the dog",
			completed: false,
		},
		{
			_id: 3,
			body: "Do laundry",
			completed: false,
		},
		{
			_id: 4,
			body: "Cook dinner",
			completed: true,
		},
	];

    // TSX to render the ToDo List
	return (
		<>
			<Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}>
				Today's Tasks
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && todos?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						All tasks completed 🤞
					</Text>
				</Stack>
			)}
			<Stack gap={3}>
				{todos?.map((todo) => (
					<TodoItem key={todo._id} todo={todo} />
				))}
			</Stack>
		</>
	);
};

// Exporting the ToDo List
export default TodoList;