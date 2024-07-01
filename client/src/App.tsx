// Importing required modules
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./contexts/authContext";
import { Toaster } from "react-hot-toast";

// Importing our custom components
import Footer from "./components/Footer";

// Importing Chakra UI components
import { Stack } from "@chakra-ui/react";

// Importing custom pages
import Home from "./pages/Home";
import LogIn from "./pages/Login";
import SignUp from "./pages/Signup";


// Creating our App
const App = () => {
  const { authUser } = useAuthContext();
  // TSX to render our App
  return (
    <Stack h="100vh" w="100vw" overflow={{base:"auto", sm:"hidden"}} position={"relative"} >
      <Routes>
        {/* All routes are inter-dependent ::->:: Only if user is LoggedIn/SingedUp then it will be sent to Home */}
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/logIn" />} />
        <Route path="/logIn" element={authUser ? <Navigate to="/" /> : <LogIn />} />
        <Route path="/signUp" element={authUser ? <Navigate to="/" /> : <SignUp />} />
      </Routes>
      <Footer />
      <Toaster />
    </Stack>
  );
};

// Exporting the App
export default App;
