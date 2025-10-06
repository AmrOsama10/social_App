import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<T> {
  constructor(protected model: Model<T>) {}
  async create(item:Partial <T>) {
    const doc = new this.model(item);
    return await doc.save();
  }
   async exist(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T>,
    option?: QueryOptions<T>
  ) {
    return await this.model.findOne(filter, projection, option);
  }

 async getOne(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T>,
    option?: QueryOptions<T>
  ) {
    return await this.model.findOne(filter, projection, option);
  }

   async update(
    filter: RootFilterQuery<T>,
    update: UpdateQuery<T>,
    option?: MongooseUpdateQueryOptions<T>
  ) {
    return await this.model.updateOne(filter, update, option);
  }
  async delete(filter: RootFilterQuery<T>) {
    return await this.model.deleteOne(filter);

  }
}