export enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  UNDER_REVIEW = "UNDER_REVIEW",
  NOTIFIED = "NOTIFIED",
  OTHER = "OTHER",
}

export enum CoTypes {
  MPA = "MPA",
  MNA = "MNA",
  MINISTER = "MINISTER",
  SENATOR = "SENATOR",
  SACM = "SACM",
  ADVISOR = "ADVISOR",
  PPPLEADER = "PPPLEADER",
  OTHER = "OTHER",
}

export enum Genders {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export type Task = {
  name: string;
  status: TaskStatus;
  workspaceId: string;
  departmentId: string;
  position: number;
  dueDate: string;
  description?: string;
  designation: string;
  coType: CoTypes;
  coName: string;
  receivedThrough: string;
};

export type Staff = {
  serialNo: number;
  personnelNo: string;
  name: string;
  fatherName?: string;
  designation?: string;
  subject?: string;
  postingPlace?: string;
  workingPlace?: string;
  cnic?: string;
  gender?: string;
  qualification?: string;
  domicileDistrict?: string;
};