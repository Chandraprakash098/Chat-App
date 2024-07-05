import React from "react";
import { ChatState } from "../../Context/chatProvider";
import { Avatar, Box,Text } from "@chakra-ui/react";

function UserListItem({ user,handleFunction }) {
  
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="green"
      _hover={{
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
        <Avatar
        mr={2}
        size='sm'
        cursor="pointer"
        name={user.name}
        src={user.pic}
        />
        <Box>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
        </Box>
    </Box>
  );
}

export default UserListItem;
