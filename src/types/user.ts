

export type User = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  status?: boolean | string;
  userType: string;
  designation: string;
  gender: string;
  StudentReferencesCode: string;
  parentContact: string;
  division: string;
  counsellorType: string[];
};
   