import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import { BiError } from 'react-icons/bi';

import { IMAGE_SRC } from '../../../types/imagesByGender';
import Translate from '../../../i18n/translate';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const messages = {
  undoId: 'commonMessages_undo',
  attachId: 'attachedClients_attachClient',
  attachedId: 'attachedClients_attached',
};

const attachedClients = (props) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [mouseHovered, setMouseHovered] = useState(false);
  const [attached, setAttached] = useState(props.client.isAttached);
  const [errorOccured, setErrorOccured] = useState(false);

  useEffect(() => {
    axios.get(`/api/profilePicture/${props.client.userName}`, { responseType: 'blob' })
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

  const attachClientToTrainingPlan = () => {
    axios.post(`/api/clients/attached/${props.trainingPlanId}/${props.client.userName}`)
      .then(() => {
        setAttached(true);
      })
      .catch(() => setErrorOccured(true));
  };

  const undoAttachClientToTrainingPlan = () => {
    axios.delete(`/api/clients/attached/${props.trainingPlanId}/${props.client.userName}`)
      .then(() => {
        setAttached(false);
      })
      .catch(() => setErrorOccured(true));
  };

  const attachButton = (
    <Button className="Button" onClick={attachClientToTrainingPlan} style={{ float: 'right' }}>
      {Translate(messages.attachId)}
    </Button>
  );

  const alreadyAttachedButton = (
    <Button
      variant={mouseHovered ? 'danger' : 'outline-success'}
      style={{ borderRadius: '8px', float: 'right' }}
      onClick={undoAttachClientToTrainingPlan}
      onMouseOver={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
    >
      {mouseHovered ? Translate(messages.undoId)
        : Translate(messages.attachedId)}
    </Button>
  );
  return (
    <Aux>
      {errorOccured ? <BiError /> : (
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
              {props.client.firstName}
              {' '}
              {props.client.lastName}
            </Card.Title>
            <Card.Text>
              (
              {props.client.userName}
              )
              {props.client.userId}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            { !attached && attachButton }
            { attached && alreadyAttachedButton }
          </Card.Footer>
        </Card>
      )}
    </Aux>
  );
};

export default attachedClients;
