const express = require('express');
const axios = require('axios');

const router = express.Router();
const {
  getKnots,
  getTaps,
  detectDocker,
  fetchTapFields,
  addConfig,
  readSchema,
  writeSchema,
  getTargets,
  addTargetConfig,
  sync,
  addTarget,
  saveKnot,
  downloadKnot,
  getToken,
  findWord
} = require('./util');

router.get('/docker', (req, res) => {
  detectDocker()
    .then((version) => {
      res.json({ version });
    })
    .catch((error) => {
      res.json({ version: '', error });
    });
});

router.get('/taps', (req, res) => {
  getTaps()
    .then((taps) => res.json({ taps }))
    .catch((error) => {
      res.json({ taps: [], error });
    });
});

router.post('/taps/', (req, res) => {
  const { tap } = req.body;
  fetchTapFields(tap)
    .then((config) => {
      res.json({
        config
      });
    })
    .catch((error) => {
      res.json({
        config: null,
        error
      });
    });
});

router.post('/tap/config/', (req, res) => {
  const { tap, config } = req.body;
  addConfig(tap, config)
    .then((schema) => res.json({ schema: schema.streams }))
    .catch((error) => {
      res.status(400).json({ error });
    });
});

router.put('/schema/', (req, res) => {
  writeSchema(req.body)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/knots', (req, res) => {
  detectDocker()
    .then(() => {
      getKnots()
        .then((knots) => res.json({ knots, docker: true }))
        .catch(() => {
          res.json([]);
        });
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

router.post('/schema/', (req, res) => {
  const { knot } = req.body;
  readSchema(knot)
    .then((schema) => {
      res.json(schema.streams);
    })
    .catch();
});

router.get('/targets/', (req, res) => {
  getTargets()
    .then((targets) => res.json(targets))
    .catch(() => {
      res.json([]);
    });
});

router.post('/target/install', (req, res) => {
  const { target, version } = req.body;
  addTarget(target, version)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch(() => {
      res.json([]);
    });
});

router.get('/token/', (req, res) => {
  const { code } = req.body;
  const params = {
    code,
    client_id: 'knot-local',
    client_secret: 'iEcKy7joLVrJgtbm6YzzhTuxwsxU.jVb',
    grant_type: 'authorization_code'
  };
  const queryString = Object.keys(params)
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  axios
    .post(`https://data.world/oauth/access_token?${queryString}`)
    .then((response) => {
      if (response.data.access_token) {
        res.json({ token: response.data.access_token });
      }
    })
    .catch(console.log);
});

router.post('/target/', (req, res) => {
  addTargetConfig(req.body)
    .then(() => res.json({ status: 200 }))
    .catch(console.log);
});

router.post('/sync/', (req, res) => {
  sync()
    .then(() => {
      res.json({ status: 200 });
    })
    .catch(() => {
      res.json({ status: 500 });
    });
});

router.post('/save-knot/', (req, res) => {
  const { name } = req.body;
  saveKnot(name)
    .then(() => res.json({ all: 'good' }))
    .catch((err) => {
      console.log('This is the error', err);
    });
});

router.post('/download/', (req, res) => {
  const { knot } = req.body;
  downloadKnot(knot)
    .then(() => res.json({}))
    .catch();
});

router.post('/token/', (req, res) => {
  const { knot } = req.body;

  console.log('sfsd', knot);
  getToken(knot)
    .then((token) => {
      console.log('This is what we are working wiht', token);
      res.json({ token });
    })
    .catch((err) => console.log('Perhaps this', err));
});

router.get('/download/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.download('abc.zip');
});

module.exports = router;
