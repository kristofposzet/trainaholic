import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import '../../Styles/Button.css';

class TableColumns extends Component {
  //  nem renderelem mindig ujra, ha pl. allitom
  // a csuszkat a sets-nel es reps-nel, illetve a gyakorlat kivalasztasanal
  // csak akkor renderelek ujra, ha a selectedExercises lista hossza valtozik vagy szerkesztettem
  // a gyakorlatot
  shouldComponentUpdate(nextProps) {
    return nextProps.length !== this.props.length || nextProps.weight !== this.props.weight
      || nextProps.sets !== this.props.sets || nextProps.reps !== this.props.reps;
  }

  render() {
    return (
      <tr>
        <td>{this.props.serialNumber}</td>
        <td>{this.props.exerciseName}</td>
        <td>{this.props.sets}</td>
        <td>{this.props.reps}</td>
        <td>{this.props.weight}</td>
        {this.props.canBeModified && (
        <td>
          <Button
            variant="outline-secondary"
            onClick={() => this.props.handleRemove(this.props.serialNumber)}
          >
            <IconContext.Provider
              value={{
                color: '#08457e',
                className: 'global-class-name',
                size: '23px',
              }}
            >
              <AiFillDelete />
            </IconContext.Provider>
          </Button>
        </td>
        )}
        {this.props.canBeModified && (
        <td>
          <Button
            variant="outline-secondary"
            onClick={() => this.props.handleEdit(this.props.serialNumber)}
          >
            <IconContext.Provider
              value={{
                color: '#08457e',
                className: 'global-class-name',
                size: '23px',
              }}
            >
              <AiFillEdit />
            </IconContext.Provider>
          </Button>
        </td>
        )}
      </tr>
    );
  }
}

TableColumns.propTypes = {
  weight: PropTypes.number,
  serialNumber: PropTypes.number,
  handleRemove: PropTypes.func,
  handleEdit: PropTypes.func,
  sets: PropTypes.number,
  reps: PropTypes.number,
  exerciseName: PropTypes.string,
  length: PropTypes.number,
  canBeModified: PropTypes.bool,
};

TableColumns.defaultProps = {
  sets: 1,
  reps: 1,
  weight: 0,
  serialNumber: null,
  handleRemove: null,
  handleEdit: null,
  exerciseName: null,
  length: null,
  canBeModified: false,
};

export default TableColumns;
