export abstract class UnitOfWorkPort {
  abstract execute<T>(work: () => Promise<T>): Promise<T>;
}
