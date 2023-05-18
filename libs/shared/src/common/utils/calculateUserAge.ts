export const calculateUserAge = (dateOfBirth: string) => {
  let today = new Date();
  let dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  let monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff == 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};
