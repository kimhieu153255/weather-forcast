import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/application/ports/IRepository';
import {
  DeepPartial,
  DeleteResult,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectId,
  RemoveOptions,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { Repository, EntityManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class BaseRepository<Entity> implements IRepository<Entity> {
  protected readonly _entityRepository: Repository<Entity>;

  constructor(entityManager: EntityManager, entity: EntityTarget<Entity>) {
    this._entityRepository = entityManager.getRepository(entity);
  }

  hasId(entity: Entity): boolean {
    return this._entityRepository.hasId(entity);
  }

  getId(entity: Entity): any {
    return this._entityRepository.getId(entity);
  }

  create(): Entity;

  create(entityLikeArray: DeepPartial<Entity>[]): Entity[];

  create(entityLike: DeepPartial<Entity>): Entity;

  create(
    plainEntityLikeOrPlainEntityLikes?:
      | DeepPartial<Entity>
      | DeepPartial<Entity>[],
  ): Entity | Entity[] {
    return this._entityRepository.create(
      plainEntityLikeOrPlainEntityLikes as any,
    );
  }

  merge(
    mergeIntoEntity: Entity,
    ...entityLikes: DeepPartial<Entity>[]
  ): Entity {
    return this._entityRepository.merge(mergeIntoEntity, ...entityLikes);
  }

  async preload(entityLike: DeepPartial<Entity>): Promise<Entity | undefined> {
    return await this._entityRepository.preload(entityLike);
  }

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  async save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    return await this._entityRepository.save(entityOrEntities as any, options);
  }

  remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;

  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;

  async remove(
    entityOrEntities: Entity | Entity[],
    options?: RemoveOptions,
  ): Promise<Entity | Entity[]> {
    return await this._entityRepository.remove(
      entityOrEntities as any,
      options,
    );
  }

  softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;

  softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;

  softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  async softRemove<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    return await this._entityRepository.softRemove(
      entityOrEntities as any,
      options,
    );
  }

  recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;

  recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  recover<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;

  recover<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  async recover<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    return await this._entityRepository.recover(
      entityOrEntities as any,
      options,
    );
  }

  async insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    return await this._entityRepository.insert(entity);
  }

  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return await this._entityRepository.update(criteria as any, partialEntity);
  }

  async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
  ): Promise<DeleteResult> {
    return await this._entityRepository.delete(criteria as any);
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptions<Entity>,
  ): Promise<UpdateResult> {
    return await this._entityRepository.softDelete(criteria as any);
  }

  async restore(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptions<Entity>,
  ): Promise<UpdateResult> {
    return await this._entityRepository.restore(criteria as any);
  }

  count(options?: FindManyOptions<Entity>): Promise<number>;

  count(conditions?: FindOptions<Entity>): Promise<number>;

  async count(
    optionsOrConditions?: FindManyOptions<Entity> | FindOptions<Entity>,
  ): Promise<number> {
    return await this._entityRepository.count(optionsOrConditions as any);
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]>;

  find(conditions?: FindOptions<Entity>): Promise<Entity[]>;

  async find(
    optionsOrConditions?: FindManyOptions<Entity> | FindOptions<Entity>,
  ): Promise<Entity[]> {
    return await this._entityRepository.find(optionsOrConditions as any);
  }

  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;

  findAndCount(conditions?: FindOptions<Entity>): Promise<[Entity[], number]>;

  async findAndCount(
    optionsOrConditions?: FindManyOptions<Entity> | FindOptions<Entity>,
  ): Promise<[Entity[], number]> {
    return this._entityRepository.findAndCount(optionsOrConditions as any);
  }

  async findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined> {
    return await this._entityRepository.findOne(options);
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    const queryRunner =
      this._entityRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
