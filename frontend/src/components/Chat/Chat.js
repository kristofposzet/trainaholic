import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import {
  Row, Jumbotron, InputGroup, FormControl, Button, Image,
} from 'react-bootstrap';
import { AiOutlineAlert } from 'react-icons/ai';
import { IoSend } from 'react-icons/io5';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import MessageMapper from './MessageMapper';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { IMAGE_SRC } from '../../types/imagesByGender';

let socket = null;

const chat = (props) => {
  const [userName, setUserName] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [errOccured, setErrOccured] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const { name, room } = queryString.parse(props.location.search);
    setUserName(name);
    setChatRoom(room);
    socket = io('/');
    // kibocsatunk egy join esemenyt, hogy csatlakozzon a user a szobahoz
    socket.emit('join', { room, user: props.userName }, (errorOccured) => {
      if (errorOccured) {
        setErrOccured(true);
      }
    });
    axios.get(`/api/profilePicture/${name}`, { responseType: 'blob' })
      .then((resp) => {
        if (resp.data.type === 'text/html') {
          if (resp.data.size === 4) {
            setProfilePicture(IMAGE_SRC.male);
          } else {
            setProfilePicture(IMAGE_SRC.female);
          }
        } else {
          setProfilePicture(window.URL.createObjectURL(resp.data));
        }
      })
      .catch(() => setProfilePicture(IMAGE_SRC.err));
    axios.get(`/api/users/chat/${name}`)
      .then((resp) => {
        setFirstName(resp.data.firstName);
        setLastName(resp.data.lastName);
      })
      .catch(() => {
        setFirstName('');
        setLastName('');
      });
    // ha meghal a komponens (unmount-ol), akkor lecsatlakoztatom a felhasznalot
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [props.location.search]);

  useEffect(() => {
    // ha kaptam egy message-et, akkor ezt az uj objektumot 2 field-del hozzateszem a meglevokhoz
    socket.on('message', (msgObj) => {
      setMessages((allMessages) => [...allMessages, msgObj]);
    });
  }, []);

  useEffect(() => {
    document.getElementById('scrollableDivForChat').scrollTop = document.getElementById('scrollableDivForChat').scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (message) {
      socket.emit('sendMessage', message, { roomName: chatRoom, user: userName }, () => setMessage(''));
    }
  };
  return (
    <Aux>
      {errOccured && <AiOutlineAlert />}
      <div style={{ marginTop: '30px', height: '60px', marginBottom: '12px' }} className="NameHolder">
        <Image
          style={{
            width: '40px', height: '40px', marginLeft: '10px',
          }}
          src={profilePicture}
          roundedCircle
        />
        {' '}
        {lastName}
        {' '}
        {firstName}
      </div>
      <div className="divElement" id="scrollableDivForChat">
        <Jumbotron>
          <MessageMapper messages={messages} toUser={userName} />
        </Jumbotron>
      </div>
      <div className="divElement" style={{ maxHeight: '100px' }}>
        <Row className="justify-content-md-center" style={{ marginLeft: '10px', boxShadow: '0 6px 5px grey', width: '98%' }}>
          <InputGroup>
            <FormControl
              id="inlineFormInputGroupChat"
              placeholder="Írjon üzenetet"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={() => sendMessage()}>
                <IoSend style={{ width: '50px', height: '22px', color: '#08457e' }} />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
      </div>
    </Aux>
  );
};

export default withRouter(chat);
