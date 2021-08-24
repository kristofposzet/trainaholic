import React from 'react';
import MenuItem from './MenuItem';

const mapMenuItems = (items, selected) => items.map((el) => {
  const { img } = el;
  const { id } = el;
  return <MenuItem key={id} image={img} selected={selected} />;
});

export default mapMenuItems;
