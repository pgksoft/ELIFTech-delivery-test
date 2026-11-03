import type { Model } from 'mongoose';

type TMongoListQuery<T> = ReturnType<Model<T>['find']>;

export default TMongoListQuery;
