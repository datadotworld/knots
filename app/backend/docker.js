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

const { spawn, exec } = require('child_process');

const dockerInstalled = () =>
  new Promise((resolve, reject) => {
    // Try to find out the docker version installed
    const docker = spawn('docker', ['-v']);

    // A version number was returned, docker is installed
    docker.stdout.on('data', (version) => {
      resolve(version.toString('utf8'));
    });

    // Threw error, no Docker
    docker.on('error', (error) => {
      reject(error);
    });
  });

const dockerRunning = () =>
  new Promise((resolve, reject) => {
    // Run a docker command to ensure it is running
    exec('docker volume ls', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

module.exports = { dockerInstalled, dockerRunning };
