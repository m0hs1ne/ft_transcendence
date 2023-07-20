import { Catch, ExceptionFilter, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(EntityNotFoundError, QueryFailedError, NotFoundException)
export class UserNotExistExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = 403; // or any other status code you want to use
    const error = "Can't perform this action!";
    response.status(status).json({ error });
  }
}