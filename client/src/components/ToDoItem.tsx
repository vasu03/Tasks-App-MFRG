// Importing required modules
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Importing Chakra UI components
import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";

// Importing React-icons
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// Importing custom components
import { Todo } from "./ToDoList";


// Creating a ToDo Item component
const TodoItem = ({ todo }: { todo: Todo }) => {
	// Initialising query client from react-query hook
	const queryClient = useQueryClient();

	// Mutation to handle the updating of a existing task
	const { mutate: updateTodo, isPending: isUpdating } = useMutation({
		// a key to identify the Mutate
		mutationKey: ["updateTodo"],
		// a function for the mutate
		mutationFn: async () => {
			if (todo.completed)
				return toast("Task already completed.");
			// updating the todo to completed state
			try {
				// send a response to server
				const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/tasks/updateTask/${todo._id}`, {
					method: "PATCH"
				});
				// capture the data from the server
				const data = await res.json();
				// show error if response is not ok
				if (!res.ok) {
					toast.error(data.error);
				}
				// show if everything goes well
				toast.success("Task completed.")
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		// what to do if mutate is successfull
		onSuccess: () => {
			// Update the local cache to avoid refreshing for fetching everytime after update
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		}
	});

	// Mutation to handle the deleting of a existing task
	const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
		// a key to identify the Mutate
		mutationKey: ["deleteTodo"],
		// a function for the mutate
		mutationFn: async () => {
			if (todo.completed)
				return toast("Task already completed.");
			// updating the todo to completed state
			try {
				// send a response to server
				const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/tasks/deleteTask/${todo._id}`, {
					method: "DELETE"
				});
				// capture the data from the server
				const data = await res.json();
				// show error if response is not ok
				if (!res.ok) {
					toast.error(data.error);
				}
				// show if everything goes well
				toast.success("Task Deleted.")
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		// what to do if mutate is successfull
		onSuccess: () => {
			// Update the local cache to avoid refreshing for fetching everytime after update
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		}
	});

	
	// TSX to render ToDo Item component
	return (
		<Flex gap={2} alignItems={"center"} >
			<Flex
				flex={1}
				alignItems={"center"}
				border={"1px"}
				borderColor={"gray.600"}
				p={2}
				borderRadius={"lg"}
				justifyContent={"space-between"}
			>
				<Text
					color={todo.completed ? "green.400" : "red.300"}
					textDecoration={todo.completed ? "line-through" : "none"}
				>
					{todo.body}
				</Text>
				{todo.completed && (
					<Badge ml='1' colorScheme='green'>
						Done
					</Badge>
				)}
				{!todo.completed && (
					<Badge ml='1' colorScheme='red'>
						Pending
					</Badge>
				)}
			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Box color={"green.400"} cursor={"pointer"} onClick={() => updateTodo()}>
					{!isUpdating && <FaCheckCircle size={20} />}
					{isUpdating && <Spinner size={"sm"} />}
				</Box>
				<Box color={"red.300"} cursor={"pointer"} onClick={() => deleteTodo()}>
					{!isDeleting && <MdDelete size={25} />}
					{isDeleting && <Spinner size={"sm"} />}
				</Box>
			</Flex>
		</Flex>
	);
};

// Exporting the ToDo Item component
export default TodoItem;