import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { CoTypes, Genders, TaskStatus } from "../types";

export const useTaskFilters = () => {
  return useQueryStates({
    departmentId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    search: parseAsString,
    dueDate: parseAsString,
    coType: parseAsStringEnum(Object.values(CoTypes)),
    gender: parseAsStringEnum(Object.values(Genders)),
    coName: parseAsString,
    receivedThrough: parseAsString,
  });
};
