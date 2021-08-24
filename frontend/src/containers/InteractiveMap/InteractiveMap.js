import React, { Component } from 'react';

import Leaflet from 'leaflet';
import {
  TileLayer, Marker, Popup, MapContainer,
} from 'react-leaflet';
import { connect } from 'react-redux';
import {
  Row, Col, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';
import { FormattedMessage } from 'react-intl';
import { BiSad } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import * as Yup from 'yup';

import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import FeedbackWrapper from '../../components/UI/Feedback/FeedbackWrapper';
import MapPersonsNearby from '../../components/InteractiveMap/MapPersonsNearby';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { VARIANT_TYPES } from '../../types/variantTypes';
import InteractiveFilter from './InteractiveFilter/InteractiveFilter';
import translate from '../../i18n/translate';

const icon = Leaflet.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

const messages = {
  clientsNearbyId: 'personsNearby_clientsNearby',
  coachesNearbyId: 'personsNearby_coachesNearby',
  unsuccessfulLoadId: 'commonMessages_unsuccessfulLoadId',
  noResultsId: 'personsNearby_noresults',
  onThisLocalityId: 'personsNearby_onThisLocality',
  onThisLocalityCoachId: 'personsNearby_onThisLocalityCoach',
};

const nameSearchSchema = Yup.object().shape({
  enteredName: Yup.string().matches(
    /^[A-ZÁÉÍÚÜŐŰ][a-záéúíóüöőű]+\s[A-ZÁÉÍÚÜŐŰ][a-záéúíóüöőű]+$/,
  ),
});

class InteractiveMap extends Component {
  state = {
    personsNearby: [],
    selectedPersonsNearby: [],
    zoom: 14,
    incorrectName: false,
  };

  componentDidMount() {
    this.props.onLoad();
    axios.get('/api/personsNearby')
      .then((res) => this.fillPersonsNearby(res.data))
      .catch((err) => {
        this.props.onError(err);
        this.props.onCloseFeedback();
      });
  }

  fillPersonsNearby = (personsNearby) => {
    // ES6 novekvo sorrendbe rendezes objektum erteke (tavolsag) szerint
    personsNearby.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    // allPersons: objektumokat tartalmazo array lesz, es ezekben az objektumokban
    // 3 kulcs lesz: latitude, longitude es egy data tomb
    // latitude es longitude szerint fogom megjeleniteni az osszes edzot vagy klienst, aki
    // azon a koordinatan regisztralt
    const allPersons = [];
    // a kulcsra nincs szuksegem, csak az ertekre
    Object.entries(personsNearby).forEach(([, personInfo]) => {
      let exists = false;
      for (let i = 0; i < allPersons.length; i += 1) {
        // ha mar letezik a fentebb letrehozott allPersons array-ben, akkor
        // az i. indexu objektumom data tombjehez hozzaadok egy uj felhasznalot
        // az informacioival egyutt
        if (allPersons[i].latitude === personInfo.latitude
              && allPersons[i].longitude === personInfo.longitude) {
          allPersons[i].data.push({
            firstName: personInfo.firstName,
            lastName: personInfo.lastName,
            distance: personInfo.distance,
            email: personInfo.email,
            gender: personInfo.gender,
            userName: personInfo.userName,
            cityName: personInfo.cityName,
            phoneNumber: personInfo.phoneNumber,
          });
          exists = true;
        }
      }
      if (!exists) {
        // kulonben beszurok egy teljesen uj objektumot
        allPersons.push({
          latitude: personInfo.latitude,
          longitude: personInfo.longitude,
          data: [{
            firstName: personInfo.firstName,
            lastName: personInfo.lastName,
            distance: personInfo.distance,
            email: personInfo.email,
            gender: personInfo.gender,
            userName: personInfo.userName,
            cityName: personInfo.cityName,
            phoneNumber: personInfo.phoneNumber,
          }],
        });
      }
    });
    this.setState({ personsNearby: [...allPersons] });
    this.setState({ selectedPersonsNearby: [...allPersons] });
    this.props.onSuccess();
    this.props.endLoad();
    this.props.onCloseFeedback();
  }

  searchUsersByName = (enteredName) => {
    nameSearchSchema
      .validate({ enteredName })
      .then(() => {
        const params = new URLSearchParams([['name', enteredName]]);
        this.props.onLoad();
        axios.get('/api/personsNearby', { params })
          .then((res) => this.fillPersonsNearby(res.data))
          .catch((err) => {
            this.props.onError(err);
            this.props.onCloseFeedback();
          });

        if (this.state.incorrectName) {
          this.setState({ incorrectName: false });
        }
      })
      .catch(() => {
        this.setState({ incorrectName: true });
      });
  }

  searchUsersByDistance = (distance) => {
    const params = new URLSearchParams([['distance', distance]]);
    this.props.onLoad();
    axios.get('/api/personsNearby', { params })
      .then((res) => this.fillPersonsNearby(res.data))
      .catch((err) => {
        this.props.onError(err);
        this.props.onCloseFeedback();
      });
  }

  onMarkerClick = (latitude, longitude) => {
    const newSelectedPersonsNearby = this.state.personsNearby.filter(
      (person) => (person.latitude === latitude && person.longitude === longitude),
    );
    this.setState({ selectedPersonsNearby: newSelectedPersonsNearby });
  }

  render() {
    // https://react-leaflet.js.org/docs/example-popup-marker/
    let position = null;
    if (this.state.personsNearby.length !== 0) {
      position = [
        this.state.personsNearby[0].latitude, this.state.personsNearby[0].longitude,
      ];
    } else {
      position = [46.770439, 23.591423];
    }
    // tömbbe objektumba tömb
    return (
      <div style={{ paddingTop: '14px' }}>
        {this.props.error && (
        <FeedbackWrapper
          variant={VARIANT_TYPES.danger}
          messageId={messages.unsuccessfulLoadId}
          showFeedback={this.props.showFeedback}
        />
        )}

        <Aux>
          <InteractiveFilter
            incorrectName={this.state.incorrectName}
            searchUsersByName={this.searchUsersByName}
            searchUsersByDistance={this.searchUsersByDistance}
          />
          {this.props.loading ? <Spinner />
            : (
              <Row>
                <Col className="InteractiveMap" md={6} xs={9} style={{ marginBottom: '20px' }}>
                  <MapContainer className="Map" center={position} zoom={this.state.zoom}>
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.personsNearby.map((personNearby, index) => (
                      <Marker
                        position={[personNearby.latitude, personNearby.longitude]}
                        icon={icon}
                        key={`${personNearby.data[0].firstName} ${index + 1}`}
                        eventHandlers={{
                          click:
                          () => this.onMarkerClick(personNearby.latitude, personNearby.longitude),
                        }}
                      >
                        <Popup>
                          {this.props.isCoach ? translate(messages.onThisLocalityId)
                            : translate(messages.onThisLocalityCoachId)}
                          {' '}
                          {personNearby.data.length}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Col>
                <Col md={4} xs={10} className="InteractiveMap" style={{ width: '100%', overflow: 'auto' }}>
                  <div style={{ backgroundColor: '#dedede', borderRadius: '10px' }}>
                    {this.props.isCoach
                      ? (
                        <Form.Label className="font-weight-bold text-center" style={{ width: '100%' }}>
                          {/* nem elegendo a text-center, a width-et is be kell allitani, h kozepen
                    legyen a szoveg */}
                          <FormattedMessage id={messages.clientsNearbyId} />
                        </Form.Label>

                      )
                      : (
                        <Form.Label className="font-weight-bold text-center" style={{ width: '100%' }}>
                          <FormattedMessage id={messages.coachesNearbyId} />
                        </Form.Label>

                      ) }
                  </div>
                  <Row className="justify-content-center" style={{ height: '79vh' }}>
                    <div>
                      {this.state.selectedPersonsNearby.length > 0 ? (
                        <MapPersonsNearby
                          personsNearby={this.state.selectedPersonsNearby}
                          userName={this.props.userName}
                        />
                      ) : (
                        <IconContext.Provider
                          value={{
                            color: '#08457e',
                            className: 'global-class-name',
                            size: '35px',
                          }}
                        >
                          <Row>
                            <BiSad />
                            <div>{translate(messages.noResultsId)}</div>
                          </Row>
                        </IconContext.Provider>
                      )}
                    </div>
                  </Row>
                </Col>
              </Row>
            )}
        </Aux>

      </div>
    );
  }
}

InteractiveMap.propTypes = {
  isCoach: PropTypes.bool,
  onLoad: PropTypes.func,
  endLoad: PropTypes.func,
  onCloseFeedback: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  error: PropTypes.instanceOf(Object),
  showFeedback: PropTypes.bool,
  loading: PropTypes.bool,
  userName: PropTypes.string,
};

InteractiveMap.defaultProps = {
  isCoach: null,
  onLoad: null,
  endLoad: null,
  onCloseFeedback: null,
  onError: null,
  onSuccess: null,
  error: null,
  showFeedback: null,
  loading: null,
  userName: null,
};

const mapStateToProps = (state) => ({
  userName: state.auth.userName,
  loading: state.inputFeedback.loading,
  error: state.inputFeedback.error,
  showFeedback: state.inputFeedback.show,
  successful: state.inputFeedback.successful,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch(actions.startLoading()),
  endLoad: () => dispatch(actions.endLoading()),
  onError: (err) => dispatch(actions.errorFeedback(err)),
  onCloseFeedback: () => setTimeout(() => {
    dispatch(actions.closeFeedback());
  }, 3000),
  onSuccess: () => dispatch(actions.successfulFeedback()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveMap);
