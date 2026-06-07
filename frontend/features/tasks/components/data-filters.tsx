import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderIcon, ListChecksIcon } from "lucide-react";
import { CoTypes, Genders, TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";

interface DataFiltersProps {
  hideDepartmentFilter?: boolean;
}

export const DataFilters = ({ hideDepartmentFilter }: DataFiltersProps) => {
  const workspaceId = 1;

  const isLoading = false;

  const departmentOptions = [
    {
      value: "1",
      label: "Name",
    },
  ];

  const [{ status, departmentId, dueDate, coType, gender }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onCoTypeChange = (value: string) => {
    setFilters({ coType: value === "all" ? null : (value as CoTypes) });
  };

  const onGenderChange = (value: string) => {
    setFilters({ gender: value === "all" ? null : (value as Genders) });
  };

  const onDepartmentChange = (value: string) => {
    setFilters({ departmentId: value === "all" ? null : (value as string) });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All designations" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All designations</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.IN_PROGRESS}>PROFESSOR</SelectItem>
          <SelectItem value={TaskStatus.UNDER_REVIEW}>ASSISTANT PROFESSOR</SelectItem>
          <SelectItem value={TaskStatus.NOTIFIED}>LECTURER</SelectItem>
          <SelectItem value={TaskStatus.OTHER}>CLERK</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={coType ?? undefined}
        onValueChange={(value) => onCoTypeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Teaching Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teaching Status</SelectItem>
          <SelectSeparator />
          <SelectItem value={CoTypes.MPA}>TEACHING</SelectItem>
          <SelectItem value={CoTypes.MNA}>NON-TEACHING</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={gender ?? undefined}
        onValueChange={(value) => onGenderChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Genders" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectSeparator />
          <SelectItem value={Genders.MALE}>MALE</SelectItem>
          <SelectItem value={Genders.FEMALE}>FEMALE</SelectItem>
        </SelectContent>
      </Select>
      {!hideDepartmentFilter && (
        <Select
          defaultValue={"all"}
          onValueChange={(value) => onDepartmentChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All qualifications" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All qualifications</SelectItem>
            <SelectSeparator />
            <SelectItem value={CoTypes.MPA}>M.PHILL</SelectItem>
            <SelectItem value={CoTypes.MNA}>PHD</SelectItem>
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Joining date"
        className="h-12 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
