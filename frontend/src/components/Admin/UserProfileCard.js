import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { BsFillTrashFill } from 'react-icons/bs';
import axios from 'axios';
import AdminDeleteModal from '../UI/Modal/AdminDeleteModal';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { IMAGE_SRC } from '../../types/imagesByGender';

const userProfileCard = (props) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    axios.get(`/api/profilePicture/${props.user.userName}`, { responseType: 'blob' })
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

  const handleDeleteUser = () => {
    axios.delete(`/api/users/${props.user.userName}`)
      .then(() => props.handleDelete())
      .catch(() => {});
  };

  return (
    <Aux>
      <AdminDeleteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleDeleteUser={() => handleDeleteUser()}
      />
      <Card style={{ width: '275px', marginTop: '10px' }}>
        <Card.Img
          variant="top"
          style={{
            height: '13vw', objectFit: 'cover', marginLeft: '7px', marginRight: '7px', marginTop: '7px', marginBottom: '7px', width: '95%',
          }}
          src={profilePicture}
        />
        <Card.Body>
          <Card.Title>
            {props.user.firstName}
            {' '}
            {props.user.lastName}
          </Card.Title>
          <Card.Text>
            (
            {props.user.userName}
            )
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="outline-secondary"
            style={{ borderRadius: '8px' }}
            onClick={() => setShowModal(true)}
          >
            <IconContext.Provider
              value={{
                color: '#bb3e03',
                className: 'global-class-name',
                size: '25px',
              }}
            >
              <BsFillTrashFill />
            </IconContext.Provider>
          </Button>
        </Card.Footer>
      </Card>
    </Aux>
  );
};

export default userProfileCard;
