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
import { Card, CardBody, CardTitle, Col } from 'reactstrap';

import getLogo from '../../../logos';
import type {
  SpecImplementationPropType,
  TapPropertiesType
} from '../../../utils/sharedTypes';

type Props = {
  name: string,
  tapKey: string,
  tapImage: string,
  selected: string,
  repo: string,
  specImplementation?: SpecImplementationPropType,
  selectTap: (tap: TapPropertiesType, knotName: string, uuid: string) => void,
  knotName: string,
  uuid: string
};

type State = {
  hovered: boolean
};

export default class Tap extends Component<Props, State> {
  static defaultProps = {
    specImplementation: {}
  };

  state = {
    hovered: false
  };

  getBorderState = () => {
    const { hovered } = this.state;
    const { tapKey, selected } = this.props;

    if (hovered) {
      return 'border-primary';
    } else if (selected === tapKey) {
      return 'border-success';
    }

    return '';
  };

  render() {
    const {
      tapKey,
      tapImage,
      repo,
      specImplementation,
      knotName,
      name
    } = this.props;

    return (
      <Col sm="12" md={{ size: 4 }} className="mb-4">
        <Card
          className={this.getBorderState()}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
          onClick={() => {
            this.props.selectTap(
              {
                name: tapKey,
                image: tapImage,
                repo,
                specImplementation
              },
              this.props.uuid,
              knotName
            );
          }}
        >
          <CardBody>
            <CardTitle className="mb-0">
              <img
                src={getLogo(tapKey)}
                alt={name}
                className="mr-3"
                style={{ width: '44px', height: '44px' }}
              />
              {name}
            </CardTitle>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
