import React from 'react';
import './ExerciseTypesScrollMenu.css';
import Image from 'react-bootstrap/Image';

const menuItem = (props) => (
  <Image
    key={props.key}
    style={{
      width: '150px',
      height: '110px',
      borderRadius: '10px',
      marginRight: '15px',
      marginLeft: '15px',
      alignContent: 'center',
    }}
    src={props.image}
    className={props.selected ? 'selected-img' : null}
  />
);

export default menuItem;
