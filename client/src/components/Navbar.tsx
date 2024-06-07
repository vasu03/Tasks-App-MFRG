// Importing Chakra UI components
import { Box, Flex, Button, useColorModeValue, useColorMode, Text, Container } from "@chakra-ui/react";
// Importing React-icons
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";


// Creating the Navbar component
const Navbar = () => {
	const { colorMode, toggleColorMode } = useColorMode();

    // TSX to render the Navbar
	return (
		<Container maxW={"1024px"}>
			<Box bg={useColorModeValue("gray.300", "gray.700")} px={4} my={4} borderRadius={"5"}>
				<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
					{/* LEFT SIDE */}
					<Flex justifyContent={"center"} alignItems={"center"} gap={3} display={{ base: "none", sm: "flex" }} >
						<Text fontSize={"lg"} fontWeight={500}>
							TODO App
						</Text>
					</Flex>

					{/* RIGHT SIDE */}
					<Flex alignItems={"center"} gap={3}>
						{/* Toggle Color Mode */}
						<Button onClick={toggleColorMode}>
							{colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Container>
	);
}

// Exporting the Navbar component
export default Navbar;