import Conversations from '../../components/conversations/Conversations';
import Message from '../../components/message/Message';
import './messenger.scss';
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
import SendAudioModal from '../../components/user/SendAudioModal';
import SendVideoModal from '../../components/user/SendVideoModal';

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewmessage] = useState('');
  const [arrivalmessage, setArrivalmessage] = useState(null);
  const { user } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const inputRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = new SpeechRecognition();
  mic.continuous = true;
  mic.interimResults = true;
  mic.lang = 'en-US';

  const scrollRef = useRef();

  const socket = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    // socket.current = io('ws://172.20.10.2:8900');
    socket.current.on('getMessage', (data) => {
      setArrivalmessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalmessage &&
      currentChat?.members.includes(arrivalmessage.sender) &&
      setMessages((prev) => [...prev, arrivalmessage]);
  }, [arrivalmessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', (users) => {
      console.log('heysi', user.followings);
      console.log('usersssss', users);
      console.log(user.followings.filter((f) => users.some((u) => u.userId === f)));
      setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
    });
  }, [user]);
  console.log('onlindfrien', onlineUsers);

  useEffect(() => {
    const getConv = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/conversations/${user._id}`,
        );
        // console.log('resinconv', res);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConv();
  }, [user._id]);
  // console.log('currenchat', currentChat);

  useEffect(() => {
    const getMess = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/messages/${currentChat._id}`,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8; audio/mp3',
            },
          },
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMess();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newmessage,
      conversationId: currentChat._id,
    };
    const receiverIdd = currentChat.members.find((member) => member !== user._id);
    console.log('receverid', receiverIdd);
    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId: receiverIdd,
      text: newmessage,
    });
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/messages`, message);
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
          <input type='text' placeholder='search for friends' />
          {conversations.map((c) => (
            <div onClick={() => setCurrentChat(c)}>
              <Conversations conversation={c} currentuser={user} />
            </div>
          ))}
        </div>
      </div>
      <div className='chatbox'>
        <div className='chatboxwrapper'>
          {currentChat ? (
            <>
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
