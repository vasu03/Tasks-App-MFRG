// Importing required modules
import { useState } from "react";
// Importing Chakra UI components
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
// Importing React-icons
import { IoMdAdd } from "react-icons/io";

// Creating the ToDo Form component
const TodoForm = () => {
    // States to handle the form changes
	const [newTodo, setNewTodo] = useState("");
	const [isPending, setIsPending] = useState(false);

	const createTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		alert("Todo added!");
	};

    // TSX to render ToDo Form
	return (
		<form onSubmit={createTodo} style={{ marginTop: "1.5rem" }}>
			<Flex gap={2}>
				<Input
					type='text'
					value={newTodo}
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
					{isPending ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};

// Exporting the ToDo Form
export default TodoForm;