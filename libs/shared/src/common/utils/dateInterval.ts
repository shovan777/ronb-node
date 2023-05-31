export const getDateInterval = (date: Date) => {
  const date_ = new Date(date);
  const currentDate = new Date();
  const timeDiff = date_.getTime() - currentDate.getTime();

  const interval = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return interval;
};
