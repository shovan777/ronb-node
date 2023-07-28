export function removeIdFromArray<T>(array_: T[], item: T): T[] {
  const index = array_.indexOf(item);

  if (index > -1) {
    array_.splice(index, 1);
  }
  return array_;
}

export function getMaxDate(): Date {
  const timeInterval = 7; //days
  const currentDate = new Date();
  const maxDate = new Date();

  maxDate.setDate(currentDate.getDate() + timeInterval);

  return maxDate;
}

export function getMinDate(): Date {
  const currentDate = new Date();
  const minDate = new Date();

  minDate.setDate(currentDate.getDate() - 1);

  return minDate;
}
