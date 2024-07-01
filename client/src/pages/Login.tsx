// Importing required modules
import { useState } from "react";
import { Link } from "react-router-dom";

// Importing custom hooks
import useLogIn from "../hooks/useLogin";

// Importing components from ChakraUI
import { Container, Button, Flex, Heading, Input, Spinner, useColorModeValue, Text } from "@chakra-ui/react";


// Creating the LogIn page
const Login = () => {
    // Some states to handle the Form value
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // A function to handle the submit of Login form
    const { loading, logIn } = useLogIn()
    const handleLogIn = async (e: any) => {
        e.preventDefault();		// to prevent default refreshing
        try {
            // A hook to perform SignUp operation
            await logIn(email, password);
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
                    Log In
                </Heading>
                <form
                    onSubmit={handleLogIn}
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem"
                    }}
                >
                    <Input id="email" type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
                    <Input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="password" />
                    <Button type="submit" bg={useColorModeValue("gray.200", "gray.600")} width={"50%"} mx={"auto"} >
                        {!loading ? "Log In" : <Spinner size={"sm"} />}
                    </Button>
                </form>
                <Text fontWeight={"400"} fontSize={"small"}>
                    Don't have an account ? <Link to="/signUp" style={{ color: "skyblue", textDecoration: "underline", cursor: "pointer", textUnderlineOffset: "3px" }}>Create here</Link>
                </Text>
            </Flex>
        </Container>
    );
};

// Exporting the Login page
export default Login;