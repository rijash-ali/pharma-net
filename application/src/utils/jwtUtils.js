import jwt from 'jsonwebtoken';
import { mspIds, usersIdentityKeys } from '../../contractUtils';

export function verifyToken(req) {
    const token = req.headers.authorization.slice(7);
    if (!token) throw new Error('User is not authorized!');
    const { mspId, userIdentity } = jwt.decode(token);
    if (!(mspId in mspIds))
        throw new Error('Invalid organization!');

    if (!(userIdentity in usersIdentityKeys))
        throw new Error('Invalid user!');

    return { mspId, userIdentity };
} 