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

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TapActions from '../actions/taps';
import Postgres from '../components/Taps/TapConfiguration/Postgres';

function mapStateToProps(state) {
  return { tapsStore: state.taps, knotsStore: state.knots };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TapActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Postgres);
