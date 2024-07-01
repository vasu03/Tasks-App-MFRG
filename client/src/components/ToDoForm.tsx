// Importing required modules
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Importing Chakra UI components
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";

// Importing React-icons
import { IoMdAdd } from "react-icons/io";


// Creating the ToDo Form component
const TodoForm = () => {
	// States to handle the form changes
	const [newTodo, setNewTodo] = useState("");

	// Initialising query client from react-query hook
	const queryClient = useQueryClient();

	// Mutation to handle the creating of a new task
	const { mutate: createTodo, isPending: isCreating } = useMutation({
		// a key to identify the Mutate
		mutationKey: ["createTodo"],
		// a function for the mutate
		mutationFn: async () => {
			// updating the todo to completed state
			try {
				if(newTodo === ""){
					return toast.error("Task can't be empty..."); 
				}
				// send a response to server
				const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/tasks/createTask`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ body: newTodo }),
					credentials: 'include'
				});
				// capture the data from the server
				const data = await res.json();
				// show error if response is not ok
				if (!res.ok) {
					toast.error(data.error);
				}
				// show if everything goes well
				setNewTodo("");
				toast.success("New Task added ;)");
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

	// TSX to render ToDo Form
	return (
		<form
			onSubmit={
				(e) => {
					e.preventDefault();
					createTodo()
				} }
			style={{ marginTop: "1rem" }}
		>
			<Flex gap={2}>
				<Input
					type='text'
					value={newTodo}
					placeholder="Add new task here..."
					borderColor="gray.500"
					onChange={(e) => setNewTodo(e.target.value)}
					ref={(input) => input && input.focus()}
				/>
				<Button
					mx={2}
					type='submit'
					_active={{
						transform: "scale(.97)",
					}}
				>
					{isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};

// Exporting the ToDo Form
export default TodoForm;