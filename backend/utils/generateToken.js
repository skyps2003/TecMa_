import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'abc123456', {
        expiresIn: '30d',
    });
};

export default generateToken;
