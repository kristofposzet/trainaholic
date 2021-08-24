import React, { useState } from 'react';
import {
  Navbar, Nav, Dropdown, NavDropdown,
} from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { HiOutlineLogout } from 'react-icons/hi';
import { MdUpdate } from 'react-icons/md';
import PropTypes from 'prop-types';
import { BsPerson } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import ReactFlagsSelect from 'react-flags-select';
import { connect } from 'react-redux';
import './Toolbar.css';
import axios from 'axios';
import { USER_ROLES } from '../../../types/userRoles';
import Translate from '../../../i18n/translate';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import ContactRequestsMapper from '../../ContactItems/ContactRequests/ContactRequestsMapper';
import UnreadMessagesMapper from '../../ContactItems/UnreadMessages/UnreadMessagesMapper';

const messages = {
  languageId: 'toolbar_messageId',
  progressId: 'toolbar_progressId',
  trainingPlansId: 'toolbar_trainingPlansId',
  clients: 'toolbar_clientsId',
  logout: 'toolbar_logoutId',
  updateProfile: 'toolbar_updateProfile',
  registerId: 'commonMessages_register',
  loginId: 'toolbar_login',
  asClientId: 'toolbar_asClient',
  asCoachId: 'toolbar_asCoach',
  coachesId: 'toolbar_coachesId',
  asAdminId: 'toolbar_asAdmin',
};

const toolbar = (props) => {
  const [usersWithPendingContact, setUsersWithPendingContact] = useState([]);
  const [unreadMsgInfos, setUnreadMsgInfos] = useState([]);

  const initUsersWithPendingContact = () => {
    axios.get('/api/personsNearby/pending')
      .then((res) => {
        setUsersWithPendingContact(res.data);
      })
      .catch(() => {
        setUsersWithPendingContact([]);
      });
  };

  const initUnreadMessagesFrom = () => {
    axios.get('/api/profile/messages/unread')
      .then((resp) => {
        setUnreadMsgInfos(resp.data.unreadInfos);
      })
      .catch(() => {
        setUnreadMsgInfos([]);
      });
  };

  return (
    <div>
      <header className="Toolbar">
        { /* kisebb kijelzore mas formaban jelenik meg az expand="lg" miatt */ }
        <Navbar expand="lg">
          <Navbar.Brand as={Link} to="/">
            <IconContext.Provider
              value={{
                color: '#08457e',
                className: 'global-class-name',
                size: '40px',
              }}
            >
              <GiWeightLiftingUp />
            </IconContext.Provider>
          </Navbar.Brand>
          <Navbar.Brand as={Link} to="/" style={{ color: '#08457e' }}>Trainaholic</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              { props.isAuthenticated && props.role !== USER_ROLES.admin && (
                <Aux>
                  <Nav.Link as={Link} to="/trainingPlans">
                    {Translate(messages.trainingPlansId)}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/personsNearby">
                    {props.role === USER_ROLES.coach
                      ? Translate(messages.clients) : Translate(messages.coachesId)}
                  </Nav.Link>
                </Aux>
              )}
            </Nav>
            <Nav>
              {!props.isAuthenticated && (
                <Aux>
                  <NavDropdown title={Translate(messages.registerId)} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={props.showRegisterAsClient}>
                      {Translate(messages.asClientId)}
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={props.showRegisterAsCoach}>
                      {Translate(messages.asCoachId)}
                    </NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title={Translate(messages.loginId)} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={props.showLoginAsClient}>
                      {Translate(messages.asClientId)}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={props.showLoginAsCoach}
                    >
                      {Translate(messages.asCoachId)}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={props.showLoginAsAdmin}
                    >
                      {Translate(messages.asAdminId)}
                    </NavDropdown.Item>
                  </NavDropdown>
                </Aux>
              )}

              { props.isAuthenticated
                  && (
                  <Dropdown onClick={() => {
                    initUsersWithPendingContact();
                    initUnreadMessagesFrom();
                  }}
                  >
                    <Dropdown.Toggle
                      variant="secondary"
                      style={{
                        // a nyilacska legyen szürke és legyen 10px távolság a flagselect-hez képest
                        padding: '0 10px', backgroundColor: '#dedede', color: '#08457e', marginRight: '10px',
                      }}
                    >
                      <Navbar.Brand>
                        <IconContext.Provider
                          value={{
                            color: '#08457e',
                            className: 'global-class-name',
                            size: '25px',
                          }}
                        >
                          <BsPerson />
                        </IconContext.Provider>
                      </Navbar.Brand>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {props.role !== USER_ROLES.admin && (
                      <Dropdown.Item as={Link} to="/personalDataUpdate">
                        <MdUpdate />
                        {' '}
                        {Translate(messages.updateProfile)}
                      </Dropdown.Item>
                      )}
                      <Dropdown.Item as={Link} to="/logout">
                        <HiOutlineLogout />
                        {' '}
                        {Translate(messages.logout)}
                      </Dropdown.Item>
                      {props.role !== USER_ROLES.admin && (
                      <ContactRequestsMapper
                        usersWithPendingContact={usersWithPendingContact}
                      />
                      )}
                      {props.role !== USER_ROLES.admin && (
                      <UnreadMessagesMapper
                        currentUser={props.isAuthenticated}
                        unreadMsgInfos={unreadMsgInfos}
                      />
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  )}

              <ReactFlagsSelect
                countries={['GB', 'HU']}
                customLabels={{
                  GB: 'English', HU: 'Magyar',
                }}
                placeholder={Translate(messages.languageId)}
                onSelect={(countryCode) => props.localeHandler(countryCode)}
              />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </div>
  );
};

toolbar.propTypes = {
  isAuthenticated: PropTypes.string,
  showLoginAsClient: PropTypes.func,
  showLoginAsCoach: PropTypes.func,
  showRegisterAsClient: PropTypes.func,
  showRegisterAsCoach: PropTypes.func,
  localeHandler: PropTypes.func,
  role: PropTypes.number,
};

toolbar.defaultProps = {
  isAuthenticated: null,
  showLoginAsClient: null,
  showLoginAsCoach: null,
  showRegisterAsClient: null,
  showRegisterAsCoach: null,
  localeHandler: null,
  role: 1,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.userName,
  role: state.auth.role,
});

export default connect(mapStateToProps)(toolbar);
