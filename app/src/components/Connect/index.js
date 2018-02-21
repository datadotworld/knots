import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import queryString from 'query-string';
import Header from '../Header';
import Loader from '../Loader';
import ConnectForm from './ConnectForm';
import Navigtion from '../Navigation';

import './Connect.css';

class Connection extends Component {
  constructor() {
    super();

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    const { tap } = queryString.parse(this.props.location.search);
    this.props.tapsStore.getTapFields(tap);
  }

  handleFieldChange(e) {
    const { name, value } = e.target;
    this.props.tapsStore.setTapFields(name, value);
  }

  submit() {
    this.props.tapsStore.submitFields();
  }

  render() {
    const { dockerInstalled } = this.props.tapsStore.dockerInstalled;
    if (dockerInstalled) {
      return (
        <div className="Connect">
          <Header>
            Configure <span className="emphasis">Redshift</span> Connection
          </Header>
          <div className="connect-body">
            {this.props.tapsStore.loading && <Loader />}
            {!this.props.tapsStore.loading && (
              <div>
                <ConnectForm
                  fields={this.props.tapsStore.tapFields}
                  handleChange={this.handleFieldChange}
                />
                <Navigtion
                  back={{ name: 'Taps', path: '/taps' }}
                  next={{
                    name: 'Schema',
                    path: '/schema',
                    onClick: this.submit
                  }}
                />
              </div>
            )}
          </div>
        </div>
      );
    }
    return <div>Install Docker to continue</div>;
  }
}

Connection.propTypes = {
  tapsStore: PropTypes.shape({
    tapFields: PropTypes.object,
    getTapFields: PropTypes.func,
    setTapFields: PropTypes.func,
    submitFields: PropTypes.func,
    loading: PropTypes.bool,
    dockerInstalled: PropTypes.bool
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired
};

export default inject('tapsStore')(observer(Connection));
