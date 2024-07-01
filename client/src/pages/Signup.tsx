// Importing required modules
import { useState } from "react";
import { Link } from "react-router-dom";

// Importing custom hooks
import useSignUp from "../hooks/useSignup";

// Importing components from ChakraUI
import { Container, Button, Flex, Heading, Input, Spinner, useColorModeValue, Text } from "@chakra-ui/react";


// Creating the SignUp page
const Signup = () => {
    // Some states to handle the Form value
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // A function to handle the submit of Login form
    const { loading, signUp } = useSignUp()
    const handleSignUp = async (e: any) => {
        e.preventDefault();		// to prevent default refreshing
        try {
            // A hook to perform SignUp operation
            await signUp(username, email, password, confirmPassword);
        } catch (error) {
            console.log(error);
        }
    };

    // TSX to render to the page
    return (
        <Container
            bg={useColorModeValue("gray.50", "gray.700")}
            width={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
            padding={"1rem"}
            mx={"auto"}
            borderRadius={"10px"}
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%, -50%)"}
        >
            <Flex
                direction={"column"}
                gap={"1rem"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Heading
                    fontSize={{ base: "large", sm: "xx-large" }}
                    fontWeight={"500"}
                >
                    Welcome to TODO App
                </Heading>
                <Heading
                    fontSize={"x-large"}
                    fontWeight={"700"}
                    letterSpacing={".1rem"}
                >
                   Sign Up
                </Heading>
                <form
                    onSubmit={handleSignUp}
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem"
                    }}
                >
                    <Input id="username" type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Username" />
                    <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
                    <Input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} placeholder="Confirm Password" />
                    <Button type="submit" bg={useColorModeValue("gray.200", "gray.600")} width={"50%"} mx={"auto"} >
                        {!loading ? "Sign Up" : <Spinner size={"sm"} />}
                    </Button>
                </form>
                <Text fontWeight={"400"} fontSize={"small"} >
                    Already have an account ? <Link to="/logIn" style={{ color: "skyblue", textDecoration: "underline", cursor: "pointer", textUnderlineOffset: "3px" }}>Login here</Link>
                </Text>
            </Flex>
        </Container>
    );
};

// Exporting the Signup page
export default Signup;