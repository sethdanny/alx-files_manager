import dbClient from '../utils/db';
const sha1 = require('sha1');

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const userExists = await dbClient.db.collection('users').findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassword = sha1(password)

        const newUser = 
        {
            email: email,
            password: hashedPassword
        }
        try {
            const result = await dbClient.db.collection('users').insertOne(newUser);
            const {_id} = result.ops[0];
            return res.status(201).json({ id: _id, email: email });
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
            
        };
    };
};

export default UsersController;
