import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Pagination from 'react-bootstrap/Pagination';

class PaginationUI extends Component {
  componentDidUpdate(prevProps) {
    const thisPage = queryString.parse(this.props.location.search).page;
    const prevPage = queryString.parse(prevProps.location.search).page;
    // ez az az eset, amikor egy query stringet tartalmazott az URL es visszamegyunk
    // az elso oldalra, amelyik nem tartalmazott, hanem csak /currentTrainingPlans alaku
    if (thisPage === undefined && prevPage !== undefined) {
      this.props.getTrainingPlans(1);
    } else
    // ha valtozott a query stringben az oldalszam, akkor betoltjuk az uj oldalt
    // pl. /currentTrainingPlans?page=3 -> /currentTrainingPlans?page=2
    if ((thisPage !== undefined && thisPage !== prevPage && thisPage <= this.props.noOfItems)) {
      this.props.getTrainingPlans(thisPage);
    }
  }

  render() {
    const currentPageNo = +this.props.currentPage;
    const noOfItems = +this.props.noOfItems;
    return (
      <Pagination size="md">
        <Pagination.First
          onClick={() => {
            this.props.getTrainingPlans(1);
            this.props.history.push(`${this.props.baseURL}page=1`);
          }}
          disabled={currentPageNo === 1}
        />
        <Pagination.Prev
          onClick={() => {
            this.props.getTrainingPlans(currentPageNo - 1);
            this.props.history.push(`${this.props.baseURL}page=${currentPageNo - 1}`);
          }}
          disabled={currentPageNo === 1}
        />

        {currentPageNo !== 1 && (
        <Pagination.Item onClick={() => {
          this.props.getTrainingPlans(currentPageNo - 1);
          this.props.history.push(`${this.props.baseURL}page=${currentPageNo - 1}`);
        }}
        >
          {currentPageNo - 1}
        </Pagination.Item>
        ) }

        <Pagination.Item
          active
          onClick={() => {
            this.props.getTrainingPlans(currentPageNo);
            this.props.history.push(`${this.props.baseURL}page=${currentPageNo}`);
          }}
        >
          {currentPageNo}
        </Pagination.Item>

        {currentPageNo < noOfItems && (
        <Pagination.Item onClick={() => {
          this.props.getTrainingPlans(currentPageNo + 1);
          this.props.history.push(`${this.props.baseURL}page=${currentPageNo + 1}`);
        }}
        >
          {currentPageNo + 1}
        </Pagination.Item>
        )}
        <Pagination.Next
          onClick={() => {
            this.props.getTrainingPlans(currentPageNo + 1);
            this.props.history.push(`${this.props.baseURL}page=${currentPageNo + 1}`);
          }}
          disabled={currentPageNo === noOfItems}
        />
        <Pagination.Last
          onClick={() => {
            this.props.getTrainingPlans(noOfItems);
            this.props.history.push(`${this.props.baseURL}page=${noOfItems}`);
          }}
          disabled={currentPageNo === noOfItems}
        />
      </Pagination>
    );
  }
}

PaginationUI.propTypes = {
  location: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  getTrainingPlans: PropTypes.func,
  baseURL: PropTypes.string,
  currentPage: PropTypes.number,
  noOfItems: PropTypes.number,
};

PaginationUI.defaultProps = {
  location: null,
  history: null,
  getTrainingPlans: null,
  baseURL: '',
  currentPage: null,
  noOfItems: null,
};

// be kell ágyazni a withRouter-be, hogy hozzáférjek a speciális history props-hoz
export default withRouter(PaginationUI);
