import React from 'react';

import '../Styles/Button.css';
import PersonCard from './PersonCard';
// https://react-bootstrap.github.io/components/cards/
const mapPersonsNearby = (props) => (
  <div>
    {props.personsNearby.map((personNearby, personIndex) => (
      <div key={`${personIndex + 1} person`}>
        {personNearby.data.map((personData, index) => (
          <div key={`${personData.firstName} ${personData.distance} ${index + 1}`}>
            <PersonCard personData={personData} userName={props.userName} />
          </div>
        ))}
        <hr />
      </div>
    ))}
  </div>
);

export default mapPersonsNearby;
