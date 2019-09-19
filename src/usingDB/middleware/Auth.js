import jwt from 'jsonwebtoken';
import db from '../db';

const Auth = {
    async verifyToken(req, res, next){
        const token = req.headers['x-access-token'];
        if(!token)
                return res.status(400).send({'message':'Token is not provided.'});

        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const text = `SELECT * FROM profile WHERE id = $1`;
            const rows = await db.query(text, [decoded.profileId]);

            if (!rows[0])
                return res.status(400).send({'message':'Invalid token.'});

            req.id = {id: decoded.profileId};
            next();
        } catch (err) {
            return res.status(400).send(err);
        }
    }
};

export default Auth;
