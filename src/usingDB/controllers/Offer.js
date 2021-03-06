import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Offer = {
    async create(req, res){
        const text = `INSERT INTO 
                    offer(id, sector, post, description, missions, knowledge, how_to_be, how_to_live, contract_type, location, handicap, created_date, modified_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;
        const values =  [uuidv4(), req.body.sector, req.body.post, req.body.description, req.body.missions, req.body.knowledge, req.body.how_to_be, req.body.how_to_live, req.body.contract_type, req.body.location, req.body.handicap, moment(new Date()), moment(new Date())];

        try{
            console.log(`adding...`);
            const rows = await db.query(text, values);
            console.log(`201`);
            return res.status(201).send(rows[0]);
        } catch(err){
            console.log(`400`);
            return res.status(400).send(err);
        }
    },

    async getAll(req, res) {
        const findAllQuery = `SELECT * FROM offer`;
        try{
            const {rows, rowCount } = await db.query(findAllQuery);
            return res.status(200).send({rows, rowCount});
        } catch(err) {
            return res.status(400).send(err);
        }
    },

    async getOne(req,res){
        const data = `SELECT * FROM offer WHERE id=$1`;
        try{
            const rows = await db.query(data, [req.params.id]);
            if(!rows[0]){
                return res.status(404).send({'message' : 'Offer not found.'});
            }
            return res.status(200).send(rows[0]);
        } catch(err) {
            return res.status(400).send(err);
        }
    },

    async update(req, res) {
        const findOneQuery = `SELECT * FROM offer where id=$1`;
        const updateOneQuery = `UPDATE offer 
                              SET sector=$1, post=$2, description=$3, missions=$4, knowledge=$5, how_to_be=$6, how_to_live=$7, constract_type=$8, location=$9, handicap=$10, modified_date=$11 
                              WHERE id=$12 returning *`;

        try{
            const rows = await db.query(findOneQuery, [req.params.id]);
            if(!rows[0]){
                return res.status(404).send({'message' : 'Offer not found.'});
            }

            const values = [req.body.sector, req.body.post, req.body.description, req.body.missions, req.body.knowledge, req.body.how_to_be, req.body.how_to_live, req.body.contract_type, req.body.location, req.body.handicap, moment(new Date()), req.params.id];
            const response = await db.query(updateOneQuery, values);

            return res.status(200).send(response.rows[0]);
        } catch(err){
            return res.status(400).send(err);
        }
    },

    async delete(req, res) {
        const deleteQuery = `DELETE
                             FROM offer
                             WHERE id = $1 returning *`;

        try {
            const rows = await db.query(deleteQuery, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({'message': 'Offer not found.'});
            }
            return res.status(204).send({'message': 'Offer deleted.'});
        } catch (err) {
            return res.status(400).send(err);
        }
    }
};

export default Offer;
