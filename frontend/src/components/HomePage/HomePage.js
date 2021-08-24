import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Container, Row, Jumbotron, Form, InputGroup, FormControl, Button,
} from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoWalkSharp } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import axios from 'axios';

import Translate from '../../i18n/translate';
import MapUsers from './ContactedUsers/MapUsersInCarousel';
import Aux from '../../hoc/Auxiliary/Auxiliary';

const messages = {
  morningId: 'homePage_morning',
  dayTimeId: 'homePage_dayTime',
  eveningId: 'homePage_evening',
  myClientsId: 'homePage_clients',
  namePatternId: 'personsNearby_namePattern',
  searchByNameId: 'personsNearby_searchByName',
  myCoachesId: 'homePage_coaches',
  noUsersConnectedId: 'homepage_noUsersConnected',
};

const homePage = (props) => {
  const [userInfos, setUserInfos] = useState({ firstName: '', lastName: '' });
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [enteredName, setEnteredName] = useState('');
  const [contactedUsers, setContacedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const intl = useIntl();
  useEffect(() => {
    axios.get('/api/users/current')
      .then((resp) => {
        setUserInfos(resp.data);
        if ((new Date().getHours()) < 9) {
          setWelcomeMessage(Translate(messages.morningId));
        } else if ((new Date().getHours() > 18)) {
          setWelcomeMessage(Translate(messages.eveningId));
        } else {
          setWelcomeMessage(Translate(messages.dayTimeId));
        }
      })
      .catch(() => {});
    axios.get('/api/home/clients')
      .then((resp) => {
        setContacedUsers([...resp.data]);
        setSelectedUsers([...resp.data]);
      })
      .catch(() => {
        setContacedUsers([]);
        setSelectedUsers([]);
      });
  }, []);

  const searchHandler = (uName) => {
    const [nameFirst, nameSecond] = uName.split(' ');
    const newSelectedUsers = contactedUsers.filter(
      (contactedUser) => ((contactedUser.firstName === nameFirst)
       && (contactedUser.lastName === nameSecond)) || (contactedUser.lastName === nameFirst
        && contactedUser.firstName === nameSecond),
    );
    setSelectedUsers(newSelectedUsers.length ? newSelectedUsers : [...contactedUsers]);
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Row className="justify-content-md-center">
        <h2>
          {welcomeMessage}
          {' '}
          {userInfos.lastName}
          {' '}
          {userInfos.firstName}
          {'!'}
        </h2>
      </Row>
      <Row style={{ marginTop: '28px' }} className="justify-content-md-center">
        <Jumbotron style={{ width: '80%' }} lg={{ offset: 2 }}>
          <h3>{Translate(props.role === 2 ? messages.myClientsId : messages.myCoachesId)}</h3>
          <Row
            className="justify-content-md-center"
            style={{
              width: '83%', margin: 'auto', marginBottom: '20px', marginTop: '20px',
            }}
          >
            {contactedUsers.length ? (
              <Aux>
                <Form.Label htmlFor="inlineFormInputGroupUsername" srOnly>
                  {Translate(messages.searchByNameId)}
                </Form.Label>
                <InputGroup>
                  <FormControl
                    id="inlineFormInputGroupUsername"
                    placeholder={intl.formatMessage({ id: messages.searchByNameId })}
                    onChange={(e) => setEnteredName(e.target.value)}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={() => searchHandler(enteredName)}>
                      <AiOutlineSearch />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Aux>
            ) : (
              <Aux>
                <IconContext.Provider
                  value={{
                    color: '#08457e',
                    className: 'global-class-name',
                    size: '23px',
                  }}
                >
                  <IoWalkSharp />
                </IconContext.Provider>
                {' '}
                {Translate(messages.noUsersConnectedId)}
              </Aux>
            )}
          </Row>
          <Row>
            <MapUsers selectedUsers={selectedUsers} role={props.role} />
          </Row>
        </Jumbotron>
      </Row>
    </Container>
  );
};

export default homePage;
