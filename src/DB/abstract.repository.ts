import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<T> {
  constructor(protected model: Model<T>) {}
  async create(item:Partial <T>) {
    const doc = new this.model(item);
    return await doc.save();
  }
  exist(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T>,
    option?: QueryOptions<T>
  ) {
    return this.model.findOne(filter, projection, option);
  }

  getOne(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T>,
    option?: QueryOptions<T>
  ) {
    return this.model.findOne(filter, projection, option);
  }

  update(
    filter: RootFilterQuery<T>,
    update: UpdateQuery<T>,
    option: MongooseUpdateQueryOptions<T>
  ) {
    return this.model.updateOne(filter, update, option);
  }
  delete(filter: RootFilterQuery<T>) {
    this.model.deleteOne(filter);
  }
}