/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

// @flow

import React, { Component } from 'react';
import {
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import classNames from 'classnames';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Tap from './Tap';
import TapConfiguration from '../../containers/TapConfiguration';
import type { TapPropertiesType } from '../../utils/sharedTypes';

type Props = {
  fetchTaps: () => void,
  tapsStore: {
    tapSelected: boolean,
    selectedTap: TapPropertiesType,
    tapsLoading: boolean,
    taps: Array<{
      name: string,
      tapKey: string,
      tapImage: string,
      repo: string
    }>
  },
  knotsStore: { knotName: string, uuid: string, knotLoaded: boolean },
  history: { push: (path: string) => void },
  location: { state?: {} },
  selectTap: (tap: TapPropertiesType) => void,
  submitConfig: (
    selectedTap: TapPropertiesType,
    fieldValues: {},
    knotName: string,
    skipDiscovery: ?boolean
  ) => void,
  tapsPageLoaded: () => void,
  loadValues: (knot: string, uuid: string) => void,
  cancel: (name: string) => void
};

type State = {
  showTaps: boolean,
  showModal: boolean
};

export default class Taps extends Component<Props, State> {
  state = {
    showTaps: true,
    showModal: false
  };

  componentWillMount() {
    const { name } = this.props.location.state || {};
    this.props.tapsPageLoaded();
    this.props.fetchTaps();

    if (name) {
      const { uuid } = this.props.knotsStore;
      this.props.loadValues(name, uuid);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tapsStore.tapSelected || nextProps.knotsStore.knotLoaded) {
      this.setState({ showTaps: false });
    }
  }

  toggleShowTaps = () => {
    this.setState({ showTaps: !this.state.showTaps });
  };

  formValid = () => {
    const { selectedTap } = this.props.tapsStore;
    if (!selectedTap.name) {
      return false;
    }

    let { valid } = this.props.tapsStore[selectedTap.name];
    if (typeof valid === 'undefined') {
      const { fieldValues } = this.props.tapsStore[selectedTap.name];

      valid = true;
      Object.keys(fieldValues).forEach((field) => {
        if (!fieldValues[field]) {
          valid = false;
        }
      });
    }
    return valid;
  };

  submit = (showModal: boolean, skipDiscovery: ?boolean) => {
    const {
      tapsStore,
      knotsStore: { knotName, knotLoaded, uuid }
    } = this.props;
    const { selectedTap } = tapsStore;
    const { fieldValues } = tapsStore[selectedTap.name];

    // When editing a knot show confirmation dialog
    if (knotLoaded && showModal) {
      this.setState({ showModal: true });
    } else {
      this.props.submitConfig(
        selectedTap,
        fieldValues,
        uuid,
        knotName,
        skipDiscovery
      );
      this.props.history.push('/schema');
    }
  };

  cancel = () => {
    const { knotName } = this.props.knotsStore;
    this.props.cancel(knotName);
    this.props.history.push('/');
  };

  // Flow fix me
  tapGrid = (
    taps: Array<{
      name: string,
      repo: string,
      tapImage: string,
      tapKey: string
    }>,
    knotName: string,
    selectedTap: { name: string }
  ) => {
    // TODO Find a cleaner way to display a list as a responsive grid with Bootstrap
    const rows = [];
    let row = [];
    for (let i = 0; i < taps.length; i += 1) {
      const tap = taps[i];
      row.push(
        <Tap
          key={tap.name}
          {...tap}
          selectTap={this.props.selectTap}
          selected={selectedTap.name}
          knotName={knotName}
          uuid={this.props.knotsStore.uuid}
        />
      );
      const lastTapInRow = (i + 1) % 3 === 0;
      const lastTap = i + 1 === taps.length;
      if (lastTapInRow || lastTap) {
        rows.push(<Row className={!lastTap ? 'mb-4' : 'mb-0'}>{row}</Row>);
        row = [];
      }
    }
    return rows;
  };

  render() {
    const { tapsStore, knotsStore } = this.props;
    const { taps, selectedTap } = tapsStore;
    const { knotName } = knotsStore;
    const { showTaps, showModal } = this.state;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Configure Tap</h2>
          <div id="accordion">
            <Card className="mt-3">
              <CardHeader>
                <Button color="link" onClick={this.toggleShowTaps}>
                  Selection
                </Button>
              </CardHeader>
              <CardBody
                className={classNames('collapse', {
                  show: showTaps
                })}
              >
                <p className="mb-4">
                  <strong>Taps</strong> extract data from any source in a
                  standard way.
                </p>
                <Container>
                  {this.tapGrid(taps, knotName, selectedTap)}
                </Container>
              </CardBody>
            </Card>

            <Card className="mt-3">
              <CardHeader>
                <Button color="link" disabled>
                  Configuration
                </Button>
              </CardHeader>
              <CardBody
                className={classNames('collapse', {
                  show: !showTaps && selectedTap
                })}
              >
                <TapConfiguration done={this.configDoneHandler} />
              </CardBody>
            </Card>
          </div>
          <div className="d-flex justify-content-end my-3">
            <Button
              color="danger"
              outline
              className="mr-2"
              onClick={this.cancel}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => this.submit(true)}
              disabled={!this.formValid()}
            >
              Continue
            </Button>
          </div>
        </Container>
        <Modal isOpen={showModal}>
          <ModalHeader>Update schema information?</ModalHeader>
          <ModalBody>
            <p>
              Select <strong>&quot;Yes&quot;</strong> if you’d like to retrieve
              the latest schema information. That will reset your replication
              options.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              outline
              onClick={() => {
                this.submit(false, true);
                this.props.history.push('/schema');
              }}
            >
              No
            </Button>
            <Button color="primary" onClick={() => this.submit(false)}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
