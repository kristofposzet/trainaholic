import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import RangeSlider from 'react-bootstrap-range-slider';
import {
  InputGroup, FormControl, Button, Row, Form, Col,
} from 'react-bootstrap';
import { useIntl } from 'react-intl';
import Translate from '../../../i18n/translate';

const messages = {
  namePatternId: 'personsNearby_namePattern',
  searchByNameId: 'personsNearby_searchByName',
  searchByDistId: 'personsNearby_searchByDist',
};

const interactiveFilter = (props) => {
  const [enteredName, setEnteredName] = useState('');
  const [distance, setDistance] = useState(25);
  const intl = useIntl();

  return (
    <Row
      className="InteractiveMap justify-content-center"
      style={{
        overflow: 'auto', width: ' 96%', margin: 'auto', marginBottom: '20px',
      }}
    >
      <Form>
        <Form.Row className="align-items-center">
          <Col lg={6} md="auto" xs="auto" style={{ marginRight: '80px', marginBottom: '10px' }}>
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
                <Button variant="outline-secondary" onClick={() => props.searchUsersByName(enteredName)}>
                  <AiOutlineSearch />
                </Button>
              </InputGroup.Append>
            </InputGroup>
            {props.incorrectName && (
            <div className="Feedback">{Translate(messages.namePatternId)}</div>)}
          </Col>
          <Col lg={4} xs="auto">
            <h6>{Translate(messages.searchByDistId)}</h6>
            <RangeSlider
              size="lg"
              value={distance}
              min={10}
              max={50}
              onChange={
                (changeEvent) => { setDistance(+changeEvent.target.value); }
              }
              tooltipLabel={(value) => `${value} km`}
            />
          </Col>
          <Col>
            <Button variant="outline-secondary" onClick={() => props.searchUsersByDistance(distance)}>
              <AiOutlineSearch />
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </Row>
  );
};

export default interactiveFilter;
