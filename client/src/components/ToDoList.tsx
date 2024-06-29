// Importing required modules
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Importing Chakra UI component
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";

// Importing our custom components
import TodoItem from "./ToDoItem";


// Creating a base type of a ToDo Item
export type Todo = {
	_id: number;
	body: string;
	completed: boolean;
}


// Creating the ToDo List component
const TodoList = () => {
	// Initialising the react-query hook to fetch data
	const { data: todos, isLoading } = useQuery<Todo[]>({
		// key to identify the query output
		queryKey: ["todos"],
		// function to execute while querying for fetching data
		queryFn: async () => {
			try {
				// send a response to the server
				const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/tasks/getTasks`);
				// get the data back from the server
				const data = await res.json();
				// if the response is not ok then show error
				if (!res.ok) {
					toast.error(data.error);
				}
				// else return data or a empty error
				return data || [];
			} catch (err) {
				console.log(err);
			}
		}
	});

	// TSX to render the ToDo List
	return (
		<>
			<Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2} bgGradient='linear(to-r, green.400, blue.400)' bgClip="text">
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
			<Stack gap={3} overflowY={"scroll"} height={"65%"}>
				{todos?.map((todo) => (
					<TodoItem key={todo._id} todo={todo} />
				))}
			</Stack>
		</>
	);
};

// Exporting the ToDo List
export default TodoList;