import express from 'express';
import dotenv from 'dotenv';
import 'babel-polyfill';
import ProfileJS from './src/usingJSObject/controllers/Profile';
import ProfileDB from './src/usingDB/controllers/Profile';
import Offer from './src/usingDB/controllers/Offer';
import Auth from './src/usingDB/middleware/Auth';

dotenv.config();
const Profile = process.env.TYPE === 'db'? ProfileDB : ProfileJS;
const app = express();


/** MIDDLEWARE */
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Server connected.'});
});


/** Profile's ENDPOINTS */
app.post('/api/profiles', Profile.create);
app.post('/api/login', Profile.signUp);
app.get('/api/profiles', Profile.getAll);  /* Only HRs can do that */
app.get('/api/profiles/:id', Auth.verifyToken, Profile.getOne);
app.put('/api/profiles/:id', Auth.verifyToken, Profile.update);
app.delete('/api/profiles/:id', Auth.verifyToken, Profile.delete);

/** Offer's ENDPOINTS */
app.post('/api/offers', Auth.verifyToken, Offer.create);
app.get('/api/offers', Offer.getAll);
app.get('/api/offers/:id', Offer.getOne);
app.put('/api/offers/:id', Auth.verifyToken, Offer.update);
app.delete('/api/offers/:id', Auth.verifyToken, Offer.delete);


/** STARTING THE SERVER... */
app.listen(process.env.PORT);
console.log('Application running on port:', process.env.PORT);
