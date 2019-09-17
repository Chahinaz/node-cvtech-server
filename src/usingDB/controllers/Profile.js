import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Profile = {
  async create(req, res){
      const text = `INSERT INTO 
                    profile(id, firstName, lastName, email, created_date, modified_date)
                    VALUES ($1, $2, $3, $4) returning *`;
      const values =  [uuidv4, req.body.firstName, req.body.lastName, req.body.email, moment(new Date()), moment(new Date())];

      try{
          const rows = await db.query(text, values);
          return res.status(201).send(rows[0]);
      } catch(err){
          return res.status(400).send(err);
      }
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
                              SET firstName=$1, lastName=$2, email=$3, modified_date=$4 
                              WHERE id=$5 returning *`;

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
