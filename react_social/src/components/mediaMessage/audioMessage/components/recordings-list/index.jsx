import useRecordingsList from '../../hooks/use-recordings-list';
import { AiFillWarning } from 'react-icons/ai';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

import { Buffer } from 'buffer';
import { AuthContext } from '../../../../../context/AuthContext';
import { useContext } from 'react';
import './recordingslist.scss';

const RecordingsList = ({ audio, currentChat }) => {
  const { recordings, deleteAudio } = useRecordingsList(audio);
  const { user } = useContext(AuthContext);
  // console.log('in recordinglist currenychat', currentChat);
  console.log('recoder', recordings);

  const toast = useToast();

  const getUint8ArrayFromBlobUrl = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return uint8Array;
  };

  const sendAudio = async () => {
    try {
      console.log('aiudos', recordings[0].audio);
      const Uint8A = await getUint8ArrayFromBlobUrl(recordings[0].audio);
      // console.log('inindexunit8a', Uint8A);
      const buffer = Buffer.from(Uint8A);
      // console.log('indexbuiffer', buffer);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/messages`, {
        sender: user._id,
        conversationId: currentChat._id,
        text: 'Audio Message',
        isMedia: true,
        buffer,
      });
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to send the Message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      console.log(err);
    }
  };

  return (
    <div>
      <div className='recordings-container'>
        {recordings.length > 0 ? (
          <>
            <h1>Your recordings</h1>
            <div className='recordings-list'>
              {recordings.map((record) => (
                <div className='record' key={record.key}>
                  <audio controls src={record.audio} />
                  <div className='delete-button-container'>
                    <button
                      className='delete-button'
                      title='Delete this audio'
                      onClick={() => deleteAudio(record.key)}>
                      Delete audio
                    </button>
                  </div>
                </div>
              ))}
              <button className='send-button' onClick={sendAudio}>
                Send audio
              </button>
            </div>
          </>
        ) : (
          <div className='no-records'>
            <AiFillWarning size={50} />
            <span>You don't have records to send</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingsList;
