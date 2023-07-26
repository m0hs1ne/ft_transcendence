import { Request } from 'express';
import { User } from '../typeorm/entities/typeof';

/**
 * RequestWithUser
 * This interface is used to add the user to the request
 */
interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;