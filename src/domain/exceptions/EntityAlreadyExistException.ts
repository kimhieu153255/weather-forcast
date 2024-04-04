import { DomainException } from './DomainException';

export class EntityAlreadyExistException extends DomainException {
  constructor(message: string) {
    super('Entity already exist: ' + message);
  }
}
