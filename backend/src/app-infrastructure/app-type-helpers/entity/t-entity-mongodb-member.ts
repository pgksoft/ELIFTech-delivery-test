import type { Types } from 'mongoose';

export type TEntityMongoDbMember = {
  _id: Types.ObjectId;
  __v?: number;
};

export type TApiEntityMongoDbMember = { id: Types.ObjectId };
