export function removeIdFromArray<T>(array_: T[], item: T): T[] {
  const index = array_.indexOf(item);

  if (index > -1) {
    array_.splice(index, 1);
  }
  return array_;
}
