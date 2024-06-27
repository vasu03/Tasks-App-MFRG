// Importing our custom components
import Navbar from "./components/Navbar";
import ToDoForm from "./components/ToDoForm"
import ToDoList from "./components/ToDoList";
// Importing Chakra UI components
import { Stack, Container } from "@chakra-ui/react"; 

// Creating our App
const App = () => {
  // TSX to render our App
  return (
    <Stack h="100vh" >
      <Navbar />
      <Container>
        <ToDoForm />
        <ToDoList />
      </Container>
    </Stack>
  );
};

export default App;