import React from 'react';
import Slider from 'react-animated-slider';
import { Button } from 'react-bootstrap';
import 'react-animated-slider/build/horizontal.css';
import '../Styles/Button.css';
import '../Background/Background.css';
import Translate from '../../i18n/translate';

// https://www.npmjs.com/package/react-animated-slider
const messages = {
  registerAsCoachId: 'slider_registerAsCoach',
  registerAsClientId: 'slider_registerAsClient',
  loginAsCoachId: 'slider_loginAsCoach',
  loginAsClientId: 'slider_loginAsClient',
  webAppForId: 'slider_webAppForClientsAndCoaches',
  haveAnAccountId: 'slider_haveAnAccount',
  iDontHaveAccountId: 'slider_iDontHaveAccount',
  easyToManageId: 'slider_easyToManage',
  coachClientRelId: 'slider_coachClientRel',
  basedOnLocationId: 'slider_basedOnLocation',
};

const content = [
  {
    title: Translate(messages.webAppForId),
    description: Translate(messages.haveAnAccountId),
    firstButton: Translate(messages.loginAsClientId),
    secondButton: Translate(messages.loginAsCoachId),
    className: 'BackgroundImage',
  },
  {
    title: Translate(messages.easyToManageId),
    description: Translate(messages.iDontHaveAccountId),
    thirdButton: Translate(messages.registerAsClientId),
    fourthButton: Translate(messages.registerAsCoachId),
    className: 'SecondBackgroundImage',
  },
  {
    title: Translate(messages.coachClientRelId),
    description: Translate(messages.basedOnLocationId),
    className: 'ThirdBackgroundImage',
  },
];

// a node modules-ban: react-animated-slider/build/horizontal.css-ben atirtam a
// height-et 95vh-ra 400px-rol
const slider = (props) => (
  <Slider autoplay={6000}>
    {content.map((item, index) => (
      <div
        key={`slider ${index + 1}`}
        className={item.className}
      >
        <div style={{ marginTop: '200px', textAlign: 'center', color: '#dedede' }}>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          {item.firstButton && (
          <Button
            style={{ marginRight: '15px', marginTop: '7px' }}
            className="SecondaryButton"
            onClick={props.showLoginAsClient}
          >
            {item.firstButton}
          </Button>
          )}
          {item.secondButton && (
          <Button
            style={{ marginRight: '15px', marginTop: '7px' }}
            className="SecondaryButton"
            onClick={props.showLoginAsCoach}
          >
            {item.secondButton}
          </Button>
          )}
          {item.thirdButton && (
          <Button
            style={{ marginRight: '15px', marginTop: '7px' }}
            className="SecondaryButton"
            onClick={props.showRegisterAsClient}
          >
            {item.thirdButton}
          </Button>
          )}
          {item.fourthButton && (
          <Button
            style={{ marginRight: '15px', marginTop: '7px' }}
            className="SecondaryButton"
            onClick={props.showRegisterAsCoach}
          >
            {item.fourthButton}
          </Button>
          )}
        </div>
      </div>
    ))}
  </Slider>
);

export default slider;
