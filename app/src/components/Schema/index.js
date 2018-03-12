import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Button, ControlLabel, Table } from 'react-bootstrap';
import Header from '../Header';
import Loader from '../Loader';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import './Schema.css';

class Schema extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.submitSchema = this.submitSchema.bind(this);
  }

  handleChange(field, index, value) {
    this.props.tapsStore.editField(index, field, value);
  }

  submitSchema() {
    this.props.tapsStore.submitSchema();
  }

  render() {
    return (
      <div className="Schema">
        <Header>
          Configure <span className="emphasis">Redshift</span> Schema
        </Header>

        <div className="schema-body">
          {this.props.tapsStore.loading && <Loader />}
          {!this.props.tapsStore.loading && (
            <div>
              <Table bordered condensed hover>
                <thead>
                  <tr>
                    <th>Table/Stream</th>
                    <th>Selected</th>
                    <th>Replication Property</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.tapsStore.tapSchema.map((stream, index) => (
                    <tr valign="middle" key={stream.tap_stream_id}>
                      <td className="stream">{stream.table_name}</td>
                      <td className="selected">
                        <Checkbox
                          checked={stream.metadata[0].metadata.selected}
                          index={index}
                          handleChange={this.handleChange}
                        />
                      </td>
                      <td className="replication">
                        <Dropdown
                          columns={Object.keys(stream.schema.properties)}
                          index={index}
                          handleChange={this.handleChange}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <form>
                <ControlLabel>Start Date</ControlLabel>
                <input type="date" className="date" />
              </form>
              <div className="navigation">
                <Link to="/connection">
                  <Button>
                    <i className="fa fa-long-arrow-left" aria-hidden="true" />Back:
                    Connection
                  </Button>
                </Link>
                <Link to="/targets">
                  <Button bsStyle="primary" onClick={this.submitSchema}>
                    Next: data.world<i
                      className="fa fa-long-arrow-right"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Schema.propTypes = {
  tapsStore: PropTypes.shape({
    tapSchema: PropTypes.object.isRequired,
    editField: PropTypes.func.isRequired,
    submitSchema: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  }).isRequired
};

export default inject('tapsStore')(observer(Schema));
