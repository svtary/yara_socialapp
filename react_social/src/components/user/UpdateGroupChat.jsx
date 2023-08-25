import { useDisclosure } from '@chakra-ui/hooks';
import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useContext } from 'react';
// import { ChatState } from '../../contexts/ChatContext';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import UserListItem from '../userAvatar/UserListItem';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UpdateGroupChat = ({
  setCurrentChat,
  currentchat,
  fetchAgain,
  setFetchAgain,
  setMessages,
  messages,
}) => {
  const token = JSON.parse(localStorage.getItem('user')).token;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  //   const { user, selectedChat, setSelectedChat } = ChatState();
  const { user } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/messages/${currentChat?._id}`,
      );
      //console.log(data);
      setLoading(false);
      setMessages(data);
      // socket.emit('join chat', selectedChat._id);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
  const handleRemove = async (userTR) => {
    console.log('r', currentchat);
    console.log('inremove', currentchat.groupAdmin._id, userTR._id, user._id);
    if (currentchat.groupAdmin._id !== user._id && userTR._id !== user._id) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/group/groupremove`,
        {
          chatId: currentchat._id,
          userId: userTR._id,
        },
        config,
      );
      user._id === userTR._id ? setCurrentChat() : setCurrentChat(data);
      setLoading(false);
      fetchMessages();
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: err.response.data.message,
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
  const handleAddUser = async (userTA) => {
    console.log('xinid', userTA._id);
    console.log('zaijiaruadd');
    console.log('cureee', currentchat);
    if (currentchat.users.find((u) => u._id === userTA._id)) {
      toast({
        title: 'User Already in group!',
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    if (currentchat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/group/groupaddnumber`,
        {
          chatId: currentchat._id,
          userId: userTA._id,
        },
        config,
      );
      console.log('dataaaa', data);
      // setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: err.response.data.message,
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // console.log(selectedChat);
      const { data } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/group/renamegroup`,
        {
          chatId: currentchat._id,
          chatName: groupChatName,
        },
        config,
      );
      // setSelectedChat(data);
      console.log('dataingtoup', data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: err.response.data.message,
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
    setGroupChatName('');
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/group/${search}`,
        config,
      );
      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 9900,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };
  return (
    <>
      <IconButton onClick={onOpen} icon={<ViewIcon />} display={{ base: 'flex' }} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          style={{
            backgroundColor: 'orangered',
            width: '400px',
            height: '500px',
            top: '100px',
            left: '550px',
            padding: '10px',
          }}>
          <ModalHeader fontSize='20px' display='flex' justifyContent='space-between'>
            ChatName: {currentchat.chatName}
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody display='flex' flexDir='column' alignItems='center' height={'2000px'}>
            <Box>
              {currentchat.users.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
              ))}
            </Box>
            <FormControl display='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                style={{ width: '300px', height: '30px', marginTop: '20px' }}
              />
              <Button
                style={{
                  backgroundColor: 'transparent',
                  height: '30px',
                  marginTop: '20px',
                }}
                variant='solid'
                colorScheme='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}>
                {' '}
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add User to group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: '367px', height: '30px', marginTop: '20px', marginBottom: '5px' }}
              />
            </FormControl>
            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => handleRemove(user)}
              colorScheme='red'
              style={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                backgroundColor: 'transparent',
                height: '40px',
              }}>
              Leave Group
            </Button>
            {/* <Button variant='ghost'>
              <Link to={`/calendar/${currentchat._id}`}>Calendar</Link>
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChat;
