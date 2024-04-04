import { IEntity } from '../shared/IEntity';

export class BaseModel implements IEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  equals(entity: IEntity): boolean {
    if (!(entity instanceof BaseModel)) return false;

    return this.id === entity.id;
  }
}
