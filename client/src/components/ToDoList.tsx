// Importing required modules
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthContext } from "../contexts/authContext";

// Importing Chakra UI component
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";

// Importing our custom components
import TodoItem from "./ToDoItem";

// Creating a base type of a ToDo Item
export type Todo = {
	_id: number;
	body: string;
	completed: boolean;
	userId: string;
}

// Creating the ToDo List component
const TodoList = () => {
	// Some global context variables
	const { authUser } = useAuthContext();

	// Initialising the react-query hook to fetch data
	const { data: todos, isLoading } = useQuery<Todo[]>({
		// key to identify the query output
		queryKey: ["todos"],
		// function to execute while querying for fetching data
		queryFn: async () => {
			try {
				// send a response to the server with the token
				const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/tasks/getTasks`, {
					headers: {
						"Content-Type": "application/json",
					},
					credentials: 'include'
				});

				// get the data back from the server
				const data = await res.json();

				// if the response is not ok then show error
				if (!res.ok) {
					toast.error(data.error);
				}

				// else return data or an empty array
				return data || [];
			} catch (err) {
				console.log(err);
				toast.error("An error occurred while fetching tasks.");
				return [];
			}
		}
	});

	// TSX to render the ToDo List
	return (
		<>
			<Text fontSize={"2xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2} display={"flex"} alignItems={"baseline"} justifyContent={"center"} gap={".3rem"} >
				<span>Hello,</span>
				<Text fontSize={"4xl"} bgGradient='linear(to-r, green.400, blue.400)' bgClip="text" >{authUser.username}</Text>
				<Text fontSize={"3xl"} >👋</Text>
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && todos?.length === 0 && (
				<Stack alignItems={"center"} justifyContent={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						All tasks completed ✌️
					</Text>
				</Stack>
			)}
			<Stack gap={3} overflowY={"scroll"} overflowX={"hidden"} maxHeight={"70%"} padding={".3rem"}>
				{todos?.map((todo) => (
					<TodoItem key={todo._id} todo={todo} />
				))}
			</Stack>
		</>
	);
};

// Exporting the ToDo List
export default TodoList;