import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row } from 'react-bootstrap';
import AttachedClients from './AttachedClients';

const attachedClientsMapper = (props) => {
  const { id } = props.match.params;
  const [clients, setClients] = useState([]);
  useEffect(() => {
    axios.get(`/api/clients/attached/${id}`)
      .then((resp) => {
        setClients(resp.data);
      })
      .catch(() => setClients(null));
  }, []);

  return (
    <div style={{ marginTop: '28px', margin: '30px' }}>
      <Row lg={6} md={3} xs={2}>
        {clients && clients.map((client) => (
          <div key={client.userName} style={{ marginRight: '45px', marginBottom: '25px' }}>
            <AttachedClients key={client.userName} client={client} trainingPlanId={id} />
          </div>
        ))}
      </Row>
    </div>
  );
};

export default attachedClientsMapper;
