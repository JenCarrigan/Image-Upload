import express from 'express';
const authRouter = express.Router();

import atty from '../models/attorneys.js';
import prov from '../models/providers.js';
import User from '../models/users.js';
import auth from './middleware.js';

let sendJSON = (res, data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
};

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then((user) => {
      req.token = user.generateToken();
      req.user = user;
      res.send(req.token);
    }).catch(next);
});

authRouter.post('/signin', auth(), (req, res) => {
  res.send(req.token);
});

authRouter.get('/attorneys', auth(), (req, res, next) => {
  atty.find({})
    .then(data => {
      return Promise.all(
        data.map(obj => {
          return prov.find({ atty: obj._id })
            .then(data => {
              obj._doc.providers = data;
              return obj;
            });
        })
      );
    })
    .then(data => sendJSON(res, data))
    .catch(next);
});

authRouter.get('/providers', auth(), (req, res, next) => {
  prov.find({})
    .populate('atty', 'name')
    .then(data => sendJSON(res, data))
    .catch(next);
});

authRouter.post('/attorneys', auth('create'), (req, res, next) => {
  atty.create(req.body)
    .then(data => sendJSON(res, data))
    .catch(next);
});

authRouter.post('/providers', auth(), (req, res, next) => {
  prov.create(req.body)
    .then(data => sendJSON(res, data))
    .catch(next);
});

authRouter.patch('/attorneys/:id', auth('update'), (req, res) => {
  res.send('Hi from attorney update!');
});

authRouter.patch('/providers/:id', auth(), (req, res) => {
  res.send('hi from provider update');
});

authRouter.delete('/attorneys/:id', auth('delete'), (req, res, next) => {
  atty.findByIdAndRemove(req.params.id)
    .then(success => {
      res.statusCode = 204;
      res.statusMessage = 'OK';
      res.end();
    })
    .catch(err => { next(); });
});

authRouter.delete('/providers/:id', auth(), (req, res, next) => {
  prov.findByIdAndRemove(req.params.id)
    .then(success => {
      res.statusCode = 204;
      res.statusMessage = 'OK';
      res.end();
    })
    .catch(err => { next(); });
});

export default authRouter;