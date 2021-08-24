import React, { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { BsChatQuoteFill } from 'react-icons/bs';
import {
  Row, Image, Form, Col, Collapse, Button,
} from 'react-bootstrap';
import axios from 'axios';
import './Comments.css';
import '../Styles/Button.css';
import { IMAGE_SRC } from '../../types/imagesByGender';
import Translate from '../../i18n/translate';
import Comment from './Comment';

const messages = {
  commentId: 'profile_comment',
  cancelId: 'commonMessages_cancelId',
  opinionsId: 'profile_opinions',
};

const comments = (props) => {
  const [writtenComment, setWrittenComment] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [openButtons, setOpenButtons] = useState(false);
  const [cachedComments, setCachedComments] = useState([]);

  const writeCommentHandler = () => {
    const currentDate = new Date();
    const creationDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      second: currentDate.getSeconds(),
    };
    axios.post(`/api/profile/comments/${props.fromUserName}`, { comment: writtenComment, creationDate })
      .then((resp) => {
        setCachedComments([...cachedComments, resp.data]);
        setOpenButtons(false);
        setWrittenComment('');
      })
      .catch(() => {
        setOpenButtons(false);
        setWrittenComment('');
      });
  };

  useEffect(() => {
    axios.get('/api/profilePicture', { responseType: 'blob' })
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
  }, []);
  return (
    <div>
      <Row className="justify-content-md-center">
        <h3>
          <IconContext.Provider
            value={{
              color: '#08457e',
              className: 'global-class-name',
              size: '35px',
            }}
          >
            <BsChatQuoteFill />
          </IconContext.Provider>
          {' '}
          {Translate(messages.opinionsId)}
        </h3>
      </Row>
      <hr className="HR" />
      <Row>
        <Col lg={1} md={1}>
          {profilePicture
          && (
            <Image
              style={{
                width: '40px', height: '40px',
              }}
              src={profilePicture}
              roundedCircle
            />
          )}
        </Col>
        <Col lg={11} md={10} style={{ marginTop: '3px' }}>
          <Form.Control
            name="comment"
            placeholder="Írjon nyilvános hozzászólást..."
            type="text"
            value={writtenComment}
            onChange={(e) => {
              e.preventDefault();
              setWrittenComment(e.target.value);
              if (e.target.value !== '' && !openButtons) {
                setOpenButtons(true);
              } else if (e.target.value === '' && openButtons) {
                setOpenButtons(false);
              }
            }}
          />
        </Col>
      </Row>
      <Collapse in={openButtons}>
        <Row style={{ marginTop: '8px' }}>
          <Col xs={{ offset: 3 }} md={{ offset: 6 }} lg={{ offset: 9 }}>
            <Button className="Button" onClick={() => writeCommentHandler()}>{Translate(messages.commentId)}</Button>
          </Col>
          <Col>
            <Button
              style={{ borderRadius: '8px' }}
              variant="secondary"
              onClick={() => {
                setOpenButtons(false);
                setWrittenComment('');
              }}
            >
              {Translate(messages.cancelId)}
            </Button>
          </Col>
        </Row>
      </Collapse>
      <hr />
      {cachedComments.length > 0 && cachedComments.map((opinion) => (
        <Comment
          opinion={opinion}
          key={opinion.commentId}
          currentUserName={props.currentUserName}
          profileUserName={props.profileUserName}
        />
      ))}
      {props.opinions && props.opinions.map((opinion) => (
        <Comment
          opinion={opinion}
          key={opinion.commentId}
          currentUserName={props.currentUserName}
          profileUserName={props.profileUserName}
        />
      ))}
    </div>
  );
};

export default comments;
