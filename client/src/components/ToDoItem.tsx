// Importing Chakra UI components
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
// Importing React-icons
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// Creating a ToDo Item component
const TodoItem = ({ todo }: { todo: any }) => {
	// TSX to render ToDo Item component
    return (
		<Flex gap={2} alignItems={"center"}>
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
				<Box color={"green.400"} cursor={"pointer"}>
					<FaCheckCircle size={20} />
				</Box>
				<Box color={"red.400"} cursor={"pointer"}>
					<MdDelete size={25} />
				</Box>
			</Flex>
		</Flex>
	);
};

// Exporting the ToDo Item component
export default TodoItem;