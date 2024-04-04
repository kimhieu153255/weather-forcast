import { DomainException } from './DomainException';

export class EntityNotFoundException extends DomainException {
  constructor(message: string) {
    super('Entity not found: ' + message);
  }
}
