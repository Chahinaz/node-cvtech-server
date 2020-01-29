import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import helper from './Helper';

const Profile = {
    async signUp(req, res){
        if(!req.body.email || !req.body.password)
            return res.status(400).send({'message':'Email or password missing.'});

        if(!helper.isValidEmail(req.body.email))
            return res.status(400).send({'message':'Invalid email.'});

        const hashPassword = helper.hashPassword(req.body.password);
        const text = `INSERT INTO 
                    profile(id, firstName, lastName, email, password, description, skills, sector, created_date, modified_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`;
        const values =  [uuidv4(), req.body.firstName, req.body.lastName, req.body.email, hashPassword, "", [""], "", moment(new Date()), moment(new Date())];

        try{
            const rows = await db.query(text, values);
            return res.status(201).send(rows[0]);
        } catch(err){
            if(err.routine === '_bt_check_unique'){
                return res.status(400).send({ 'message': 'That email already exists.' })
            }
            return res.status(400).send(err);
        }
    },

    async signIn(req,res){
        if(!req.body.email || !req.body.password)
            return res.status(400).send({'message': 'Email or password missing.'});

        if(!helper.isValidEmail(req.body.email))
            return res.status(400).send({ 'message': 'Please enter a valid email address.' });

        const text = `SELECT * FROM profile where email=$1`;

        try{
            const {rows} = await db.query(text, [req.body.email]);

            if(!rows[0])
                return res.status(400).send({'message': "This email doesn't have an account yet."});

            if(!helper.comparePassword(rows[0].password, req.body.password))
                return res.status(400).send({ 'message': 'Incorrect password' });

            const token = helper.generateToken(rows[0].id);
            return res.status(200).send({token});
        } catch(err) {
            return res.status(400).send(err);
        }
    },

    async logOut(req,res){
        console.log(req.logout().token);
        req.logout();
        res.redirect('/api/signin');
    },

    async getAll(req, res) {
        const findAllQuery = `SELECT * FROM profile`;
        try{
            const {rows, rowCount } = await db.query(findAllQuery);
            return res.status(200).send({rows, rowCount});
        } catch(err) {
            return res.status(400).send(err);
        }
    },

    async getOne(req,res){
      const data = `SELECT * FROM profile WHERE id=$1`;
      try{
          const rows = await db.query(data, [req.params.id]);
          if(!rows[0]){
              return res.status(404).send({'message' : 'Profile not found.'});
          }
          return res.status(200).send(rows[0]);
      } catch(err) {
          return res.status(400).send(err);
      }
    },

    async update(req, res) {
      const findOneQuery = `SELECT * FROM profile where id=$1`;
      const updateOneQuery = `UPDATE profile 
                              SET firstName=$1, lastName=$2, email=$3, password=$4, modified_date=$5 
                              WHERE id=$6 returning *`;

      try{
        const rows = await db.query(findOneQuery, [req.params.id]);
        if(!rows[0]){
            return res.status(404).send({'message' : 'Profile not found.'});
        }

        const values = [req.body.firstName, req.body.lastName, req.body.email, moment(new Date()), req.params.id];
        const response = await db.query(updateOneQuery, values);

        return res.status(200).send(response.rows[0]);
      } catch(err){
          return res.status(400).send(err);
      }
    },

    async delete(req, res) {
        const deleteQuery = `DELETE
                             FROM profile
                             WHERE id = $1 returning *`;

        try {
            const rows = await db.query(deleteQuery, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({'message': 'Profile not found.'});
            }
            return res.status(204).send({'message': 'Profile deleted.'});
        } catch (err) {
            return res.status(400).send(err);
        }
    }
};

export default Profile;
