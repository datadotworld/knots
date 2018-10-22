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

import React, { Component } from 'react';
import Select from 'react-select';

type Props = {
  values: Array<string>,
  defaultValues: Array<string>,
  isMulti: boolean,
  streamMetadata: { index?: number, metadata?: {} },
  index: number,
  handleChange: (args: {}) => void,
  field: string
};

const colourStyles = {
  multiValue: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? 'hsl(0,0%,90%)' : '#5c56a5',
    color: isDisabled ? '#000' : '#fff'
  }),
  multiValueLabel: (styles, { isDisabled }) => ({
    ...styles,
    color: isDisabled ? '#000' : '#fff'
  })
};

export default class KeyFields extends Component<Props> {
  constructor(props) {
    super(props);

    const { defaultValues } = props;

    this.state = {
      selectedOptions: defaultValues.map((value) => ({
        value,
        label: value
      }))
    };
  }

  getOptions = () => {
    const { values } = this.props;

    return values.map((value) => ({
      value,
      label: value
    }));
  };

  handleChange = (selectedOptions) => {
    const { field } = this.props;

    if (field === 'keyFields') {
      const metadata = this.props.streamMetadata;
      const metadataIndex = metadata.index;
      const propertyType = metadata['is-view']
        ? 'view-key-properties'
        : 'table-key-properties';

      this.props.handleChange(
        this.props.index,
        `metadata[${metadataIndex}].metadata[${propertyType}]`,
        selectedOptions.map((option) => option.value)
      );
    }

    this.setState({ selectedOptions });
  };

  render() {
    if (this.props.values.length < 1) {
      return 'N/A';
    }

    return (
      <Select
        styles={colourStyles}
        options={this.getOptions()}
        value={this.state.selectedOptions}
        isMulti={this.props.isMulti}
        onChange={this.handleChange}
      />
    );
  }
}
