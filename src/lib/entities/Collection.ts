export interface Collection<T> {
  data: T[];
}

export const makeCollection = <T>(data: T[] = []): Collection<T> => ({ data });
