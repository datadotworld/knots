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
import { FormGroup, Input } from 'reactstrap';

type Props = {
  index: string,
  columns: Array<string>,
  stream: { metadata: Array<{}> },
  handleChange: (field: string, index: string, value: boolean | string) => void
};

export default class Dropdown extends Component<Props> {
  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    this.props.handleChange('replication-key', this.props.index, value);
  };

  getOptions(columns) {
    let indexToUpdate;
    let selectedOption;

    this.props.stream.metadata.forEach((metadata, index) => {
      if (metadata.breadcrumb.length === 0) {
        indexToUpdate = index;
      }
    });

    if (indexToUpdate !== undefined) {
      // Select a stream when a user chooses its replication key
      selectedOption = this.props.stream.metadata[indexToUpdate].metadata[
        'replication-key'
      ];
    }

    return (
      <Input
        type="select"
        name="select"
        id="replicationKeys"
        onChange={this.handleChange}
        defaultValue={selectedOption || ''}
      >
        <option value="" hidden>
          Please select
        </option>
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </Input>
    );
  }

  render() {
    if (this.props.columns.length < 1) {
      return 'N/A';
    }

    return (
      <FormGroup style={{ margin: '0' }}>
        {this.getOptions(this.props.columns)}
      </FormGroup>
    );
  }
}
