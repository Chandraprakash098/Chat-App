import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const boxWidth = useBreakpointValue({
    base: "90%", // Adjust as needed for smaller screens
    sm: "80%",
    md: "60%",
    lg: "50%", // Adjust for larger screens like laptops
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        flexDirection="column"
        backgroundColor="pink"
        alignItems="center"
        justifyContent="center"
        p={3}
        w="100%"
        m="15px 0px 5px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontFamily="work sans"
          color="black"
        >
          UPASANA
        </Text>
      </Box>
      <Box bg="white" p={4} w="100%" borderRadius="lg" borderWidth="2px">
        {showLogin ? <Login /> : <Signup />}
        <Button
          variant="link"
          colorScheme="blue"
          onClick={() => setShowLogin(!showLogin)}
          mt={4}
          mb={2}
          alignSelf="center"
          _hover={{ bg: "blue.200" }}
          _active={{ bg: "blue.500" }}
          bg="blue.400"
          borderRadius="md"
          px={6}
          py={2}
          color="white"
          width="100%"
        >
          {showLogin ? "New user? SIGN UP" : "Already registered? Click Here"}
        </Button>
      </Box>
    </Container>
  );
}

export default Homepage;
