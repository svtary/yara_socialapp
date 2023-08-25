import { useDisclosure } from '@chakra-ui/hooks';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import Calls from './Calls';

const SendVideoModal = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='#DDDDDD' w={400} p={10} position='fixed' left='50%' bottom='10%'>
          <ModalHeader pos='relative' mb={10} fontSize={20}>
            Video Chat
            <ModalCloseButton pos='absolute' top='0' right='0' />
          </ModalHeader>

          <ModalBody>
            <Calls />
          </ModalBody>

          <ModalFooter p={20}>
            <Button
              w={100}
              h={30}
              border='none'
              bgColor='#99BBFF'
              borderRadius={10}
              colorScheme='blue'
              mr={3}
              onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendVideoModal;
