import { ChatIcon } from '@chakra-ui/icons';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import {Image} from '@chakra-ui/react'

function ProfileModel({user,children}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Button onClick={onOpen}>
        {children || <ChatIcon />} {/* Use the children or a default icon */}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            display="flex"
            justifyContent="center"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
            />
            Email:{user.email}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ProfileModel