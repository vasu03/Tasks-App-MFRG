// Importing UI components from ChakraUI
import { Text, Box, useColorModeValue } from "@chakra-ui/react"
import { BiCodeAlt } from "react-icons/bi";

// Creating the Footer component
const Footer = () => {

    // TSX to render the footer component
    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            paddingBlock={".3rem"}
            paddingInline={"2rem"}
            position={"fixed"}
            bottom={"0"}
            right={"0"}
            left={"0"}
            bg={useColorModeValue("gray.200", "rgb(29, 37, 50)")}
            color={useColorModeValue("gray.500", "gray.400")}
            width={"100%"}
        >
            <Text
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={".3rem"}
                textAlign={"center"}
                fontSize={"x-small"}
            >
                <BiCodeAlt fontSize={"medium"} />
                by Vasu Makadia
            </Text>
        </Box>
    );
};

// Exporting the Footer component
export default Footer;