import mongoose from 'mongoose';
import type { ReadPreferenceLike, ReadConcernLike, WriteConcern } from 'mongodb';

export async function runInTransaction<T>(
  fn: (session: mongoose.ClientSession) => Promise<T>,
  options?: {
    readPreference?: ReadPreferenceLike;
    readConcern?: ReadConcernLike;
    writeConcern?: WriteConcern;
    maxCommitTimeMS?: number;
  },
): Promise<T> {
  const session = await mongoose.startSession();
  try {
    let result: T;
    await session.withTransaction(
      async () => {
        result = await fn(session);
      },
      {
        readPreference: options?.readPreference ?? 'primary',
        readConcern: options?.readConcern ?? { level: 'local' },
        writeConcern: options?.writeConcern ?? { w: 'majority' },
        maxCommitTimeMS: options?.maxCommitTimeMS,
      },
    );
    // @ts-expect-error result assigned in withTransaction
    return result;
  } finally {
    session.endSession();
  }
}
