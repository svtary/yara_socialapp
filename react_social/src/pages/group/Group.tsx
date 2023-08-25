import Conversations from '../../components/conversations/Conversations';
import Message from '../../components/message/Message';
import './group.scss';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import Chatonline from '../../components/chatonline/Chatonline';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Button, border } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import SendAudioModal from '../../components/user/SendAudioModal';
import SendVideoModal from '../../components/user/SendVideoModal';
import GroupChatModal from '../../components/user/GroupChatModal';
import UpdateGroupChat from '../../components/user/UpdateGroupChat';

let selectedChatCompare: any;
export default function Group() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = new SpeechRecognition();
  mic.continuous = true;
  mic.interimResults = true;
  mic.lang = 'en-US';
  const groupURL =
    'https://ts1.cn.mm.bing.net/th/id/R-C.4e6489c2df6b9806d2e24bf5738d86fb?rik=yCaBuILIsiW41w&riu=http%3a%2f%2fpic.616pic.com%2fys_img%2f00%2f23%2f73%2fYmR7RlD9sn.jpg&ehk=4nMZGb0paXDCDHHhmaxox6JeVMG7lnPkKwxlIAkXOT0%3d&risl=&pid=ImgRaw&r=0';
  const token = JSON.parse(localStorage.getItem('user')).token;
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewmessage] = useState('');

  const { user } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const inputRef = useRef(null);

  const scrollRef = useRef();

  const socket = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    // socket.current = io('ws://172.20.10.2:8900');
  }, []);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', (users) => {
      console.log('heysi', user.followings);
      console.log(user.followings.filter((f) => users.some((u) => u.userId === f)));
      setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
    });
  }, [user]);

  // console.log('onlindfrien', onlineUsers);
  const getConv = async () => {
    //左侧聊天列表
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/group`, config);
      // console.log('gtoup', res);
      setConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log('wozaigetcoveuedseffec');

    getConv();
  }, [fetchAgain]);

  // console.log('currenchat', currentChat);

  useEffect(() => {
    console.log('wozaigetmsssusedd');
    const getMess = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/messages/${currentChat?._id}`,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8; audio/mp3',
            },
          },
        );
        // console.log('resada', res.data);
        setMessages(res.data);
        socket.current.emit('join chat', currentChat._id);
      } catch (err) {
        console.log(err);
      }
    };
    getMess();
    selectedChatCompare = currentChat;
  }, [currentChat]);

  useEffect(() => {
    console.log('inansucoskaurece');
    socket.current.on('message received', (newMessageReceived) => {
      // console.log('neredrreve', newMessageReceived);
      console.log('园mess', messages);
      //console.log(newMessageReceived);
      //throw a notification, when im not in the selected chat that:
      //   if (
      //     !selectedChatCompare ||
      //     selectedChatCompare._id !== newMessageReceived.newMessageReceived.chat._id
      //   ) {
      //     if (!notifications.includes(newMessageReceived.newMessageReceived)) {
      //       addNotification(newMessageReceived.newMessageReceived, newMessageReceived.chat);
      //       setNotifications([newMessageReceived.newMessageReceived, ...notifications]);
      //       setFetchAgain(!fetchAgain);
      //     }
      //     //If im inside the chat, show it immediately
      //   } else {
      //     setMessages([...messages, newMessageReceived.newMessageReceived]);
      //     //console.log(messages);
      //   }
      // });
      // if (socket.connected) return () => socket.removeAllListeners('message received');

      setMessages(newMessageReceived.newMessageReceived);
      setFetchAgain(!fetchAgain);
    });
  }, [fetchAgain]);

  useEffect(() => {
    console.log('wozaiscrlll');
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newmessage,
      conversationId: currentChat._id,
    };
    // const receiverIdd = currentChat.members.find((member) => member !== user._id);
    // console.log('receverid', receiverIdd);
    // socket.current.emit('sendMessage', {
    //   senderId: user._id,
    //   receiverId: receiverIdd,
    //   text: newmessage,
    // });
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/messages`, message);
      const newm = [...messages, res.data];
      // console.log('newm', newm);
      socket.current.emit('new message', { currentChat, res, newm, room: currentChat._id });
      // console.log('redsdfgg', res.data);
      setMessages([...messages, res.data]);
      setNewmessage('');
    } catch (err) {
      console.log(err);
    }
  };
  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setNewmessage(
        newmessage.substring(0, selectionStart) + emoji + newmessage.substring(selectionEnd),
      );
      setOpenPicker(false);

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  // console.log('mess', messages);
  return (
    <div className='messenger'>
      <div className='chatmenu'>
        <div className='chatmenuwrapper'>
          <div className='topsear'>
            <input type='text' placeholder='search' />
            <GroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              conversations={conversations}
              setConversation={setConversations}>
              <Button
                display='flex'
                fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
                rightIcon={<AddIcon style={{ color: 'orangered' }} />}></Button>
            </GroupChatModal>
          </div>

          {conversations.map((c: any) => (
            <div onClick={() => setCurrentChat(c)}>
              {/* <Conversations conversation={c} currentuser={user} /> */}
              <>
                <div className='conversations'>
                  <img className='conversationimg' crossOrigin='anonymous' src={groupURL} alt='' />
                  <span className='conversationame'>{c?.chatName} </span>
                </div>
              </>
            </div>
          ))}
        </div>
      </div>
      <div className='chatbox'>
        <div className='chatboxwrapper'>
          {currentChat ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'end', backgroundColor: 'orangered' }}>
                <span>Settings</span>
                <UpdateGroupChat
                  currentchat={currentChat}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  conversations={conversations}
                  messages={messages}
                  setCurrentChat={setCurrentChat}
                  setMessages={setMessages}
                />
              </div>
              <div className='chatboxtop'>
                {messages.map((m) => (
                  <div ref={scrollRef}>
                    {' '}
                    <Message message={m} own={m.sender === user._id} current={currentChat} />
                  </div>
                ))}
              </div>
              <div className='chatboxbottom'>
                <SendAudioModal currentChat={currentChat}>
                  <button className='chatsubmmitbutton'>
                    <MicNoneOutlinedIcon />
                  </button>
                </SendAudioModal>

                <textarea
                  className='chatmessageinput'
                  placeholder='write somthing'
                  ref={inputRef}
                  onChange={(e) => setNewmessage(e.target.value)}
                  value={newmessage}></textarea>
                <button className='chatsubmmitbutton'>
                  <EmojiEmotionsOutlinedIcon
                    onClick={() => {
                      setOpenPicker(!openPicker);
                    }}
                  />{' '}
                </button>
                <button className='chatsubmmitbutton' onClick={handleSubmit}>
                  <SendOutlinedIcon />
                </button>
                <button className='chatsubmmitbutton'>
                  <UploadOutlinedIcon />
                </button>
                <SendVideoModal>
                  <button className='chatsubmmitbutton'>
                    <AddIcCallIcon />
                  </button>
                </SendVideoModal>
              </div>

              <div
                style={{
                  zIndex: 10,
                  position: 'fixed',
                  display: openPicker ? 'inline' : 'none',
                  bottom: '81px',
                  right: '150px',
                }}>
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => {
                    handleEmojiClick(emoji.native);
                  }}
                />
              </div>
            </>
          ) : (
            <span className='noconv'>Open a conversation to start a chat</span>
          )}
        </div>
      </div>
      <div className='chatonine'>
        <div className='chatonlinewrapper'>
          <Chatonline
            onlineUsers={onlineUsers}
            currentId={user._id}
            setCurrentchat={setCurrentChat}
          />
        </div>
      </div>
    </div>
  );
}
