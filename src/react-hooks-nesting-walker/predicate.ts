export type Predicate<T> = (t: T) => boolean;

export type TypeGuardPredicate<T, U extends T> = (t: T) => t is U;
