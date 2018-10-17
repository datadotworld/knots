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

import type { Stream } from './sharedTypes';

// Find metadata with empty breadcrumb and return its index and metadata
export const getMetadata = (
  stream: Stream
): { index: number, metadata: {} } => {
  const { metadata } = stream;

  let index;
  metadata.forEach((meta, metaIndex) => {
    if (meta.breadcrumb.length === 0) {
      index = metaIndex;
    }
  });

  if (index === undefined) {
    return { index: null, metadata: null };
  }

  return { index, metadata: metadata[index].metadata };
};

export const ab = 'ab';
