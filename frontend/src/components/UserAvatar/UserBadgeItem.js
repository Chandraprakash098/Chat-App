import { CloseIcon } from '@chakra-ui/icons'
import { Box, CloseButton } from '@chakra-ui/react'
import React from 'react'

function UserBadgeItem({ user, handleFunction }) {
  console.log("handleFunction type:", typeof handleFunction);

  return (
    <Box
      display="flex"
      alignItems="center"
      m={1}
      p={2}
      borderRadius="lg"
      variant="solid"
      fontSize={12}
      backgroundColor="purple.500"
      color="white"
    >
      {user.name}
      <CloseButton onClick={handleFunction} size="sm" ml={2} />
    </Box>
  );
}

export default UserBadgeItem