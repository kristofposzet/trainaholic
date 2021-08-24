import React from 'react';
import { Carousel, Image } from 'react-bootstrap';

import PrevIcon from '../../../assets/images/icon-previous.png';
import NextIcon from '../../../assets/images/icon-next.png';
import ContactedPersonCard from './ContactedPersonCard';

const mapUsers = (props) => (
  <Carousel
    nextIcon={<Image src={NextIcon} style={{ width: '2vh' }} />}
    prevIcon={<Image src={PrevIcon} style={{ width: '2vh' }} />}
    style={{ width: '80%', margin: 'auto' }}
  >
    {props.selectedUsers.map((contactedUser) => (
      <Carousel.Item
        className="justify-content-md-center"
        style={{
          backgroundColor: 'white',
          marginBottom: '30px',
        }}
        key={`${contactedUser.userName}-${new Date()}`}
      >
        <span style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <ContactedPersonCard personData={contactedUser} role={props.role} />
        </span>
      </Carousel.Item>
    ))}
  </Carousel>
);

export default React.memo(mapUsers);
