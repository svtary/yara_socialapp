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
import RecorderControls from '../mediaMessage/audioMessage/components/recorder-controls';
import RecordingsList from '../mediaMessage/audioMessage/components/recordings-list';
import useRecorder from '../mediaMessage/audioMessage/hooks/useRecorder';

const SendAudioModal = ({ children, currentChat }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { recorderState, ...handlers } = useRecorder();
  const { audio } = recorderState;

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='#DDDDDD' w={400} p={10} position='fixed' left='50%' bottom='10%'>
          <ModalHeader pos='relative' mb={10} fontSize={20}>
            Send audio messages
            <ModalCloseButton pos='absolute' top='0' right='0' />
          </ModalHeader>

          <ModalBody>
            <RecorderControls recorderState={recorderState} handlers={handlers} />
            <RecordingsList audio={audio} currentChat={currentChat} />
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

export default SendAudioModal;
