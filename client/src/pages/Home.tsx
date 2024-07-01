// Importing components from ChakraUI
import { Container, Stack } from "@chakra-ui/react";

// Importing custom components
import Navbar from "../components/Navbar";
import ToDoForm from "../components/ToDoForm";
import ToDoList from "../components/ToDoList";

// Creating our home page
const Home = () => {
    // TSX to render the home page
    return (
        <Stack h="max-content" overflow={"hidden"}>
            <Navbar />
            <Container overflow={"auto"}>
                <ToDoForm />
                <ToDoList />
            </Container>
        </Stack>
    );
};

// Exporting the Home page
export default Home;