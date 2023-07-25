import { Request } from 'express';
import { User } from '../typeorm/entities/typeof';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;