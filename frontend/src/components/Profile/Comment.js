import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Row, Col, Image, Form,
} from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import { FaRegFrown } from 'react-icons/fa';
import { IconContext } from 'react-icons';

import { IMAGE_SRC } from '../../types/imagesByGender';
import Aux from '../../hoc/Auxiliary/Auxiliary';

const comment = (props) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  useEffect(() => {
    axios.get(`/api/profilePicture/${props.opinion.from.userName}`, { responseType: 'blob' })
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

  const deleteHandler = () => {
    axios.delete(`/api/profile/comments/${props.profileUserName}/commented/${props.opinion.commentId}`)
      .then(() => {
        setDeleted(true);
      })
      .catch(() => setErrorOccured(true));
  };

  const writtenAt = `(${new Date(props.opinion.creationDate.year,
    props.opinion.creationDate.month,
    props.opinion.creationDate.day,
    props.opinion.creationDate.hour,
    props.opinion.creationDate.minute, 0, 0).toLocaleDateString(
    navigator.language, { hour: '2-digit', minute: '2-digit' },
  )})`;

  return (
    !deleted && (
    <Aux>
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
        <Col lg={11} md={10}>
          <Row>
            <Col style={{ padding: '0px' }}>
              <Form.Label className="font-weight-bold">
                {props.opinion.from.firstName}
                {' '}
                {props.opinion.from.lastName}
              </Form.Label>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              <i>
                {writtenAt}
              </i>
            </Col>
            {props.currentUserName === props.opinion.from.userName && (
            <IconContext.Provider
              value={{
                color: '#08457e',
                className: 'global-class-name',
                size: '25px',
              }}
            >
              {errorOccured ? <FaRegFrown /> : <BsFillTrashFill onClick={() => deleteHandler()} />}
            </IconContext.Provider>
            )}
          </Row>
          <Row>
            {props.opinion.comment}
          </Row>
        </Col>
      </Row>
      <hr />
    </Aux>
    )
  );
};
export default comment;
