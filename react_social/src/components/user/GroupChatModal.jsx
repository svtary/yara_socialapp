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
  useToast,
  FormControl,
  Input,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
// import { ChatState } from '../../contexts/ChatContext';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
const GroupChatModal = (
  { children },
  fetchAgain,
  setFetchAgain,
  conversations,
  setConversations,
) => {
  const token = JSON.parse(localStorage.getItem('user')).token;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  // const { user, chats, setChats } = ChatState();
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState();
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
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const { data: any } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/group/creategroup`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );
      console.log('datain friyod', data);
      // setChats([data, ...chats]);
      setConversations([data, ...conversations]);
      setFetchAgain(!fetchAgain);
      onClose();
      toast({
        title: 'New Group Chat Created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (err) {
      toast({
        title: 'Failed to Create the Chat!',
        description: err.response.data,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  const handleDelete = (u) => {
    setSelectedUsers((preVal) => {
      return preVal.filter((user) => user._id !== u._id);
    });
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

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
            Create your group chat:
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody display='flex' flexDir='column' alignItems='center' height={'150px'}>
            <FormControl>
              <Input
                placeholder='Chat name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                style={{ width: '300px', height: '30px', marginTop: '20px' }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add member names'
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: '300px', height: '30px', marginTop: '20px' }}
              />
            </FormControl>
            <Box display='flex' justifyContent='center' flexDir='row' gap='5px'>
              {/* 改到这了 */}
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSubmit}
              style={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                backgroundColor: 'transparent',
                height: '40px',
              }}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
