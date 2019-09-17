import express from 'express';
import dotenv from 'dotenv';
import 'babel-polyfill';
import ProfileJS from './src/usingJSObject/controllers/Profile';
import ProfileDB from './src/usingDB/controllers/Profile';

dotenv.config();
const Profile = process.env.TYPE === 'db'? ProfileDB : ProfileJS;
const app = express();

/** MIDDLEWARES */
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Server connected.'});
});

/** ENDPOINTS */
app.post('/api/profiles', Profile.create);
app.get('/api/profiles', Profile.getAll);
app.get('/api/profiles/:id', Profile.getOne);
app.put('/api/profiles/:id', Profile.update);
app.delete('/api/profiles/:id', Profile.delete);

/** STARTING THE SERVER... */
app.listen(process.env.PORT);
console.log('Application running on port:', process.env.PORT);
