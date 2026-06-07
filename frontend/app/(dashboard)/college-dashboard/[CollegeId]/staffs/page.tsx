// "use client";

// import { DottedSeparator } from "@/components/dotted-separator";
// import { useQueryState } from "nuqs";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Loader, PlusIcon } from "lucide-react";
// import { DataFilters } from "@/features/tasks/components/data-filters";
// import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
// import { DataTable } from "@/features/tasks/components/data-table";
// import { columns } from "@/features/tasks/components/columns";

// interface TaskViewSwitcherProps {
//   hideDepartmentFilter?: boolean;
// }

// const StaffsPage = ({ hideDepartmentFilter }: TaskViewSwitcherProps) => {
//   const [{ status, departmentId, dueDate, coType, coName, receivedThrough }] =
//     useTaskFilters();

//   const [view, setView] = useQueryState("task-view", {
//     defaultValue: "table",
//   });

//   return (
//     <Tabs
//       defaultValue={view}
//       onValueChange={setView}
//       className="flex-1 w-full border rounded-lg"
//     >
//       <div className="h-full flex flex-col overflow-auto p-4">
//         <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
//           <p className="text-lg font-semibold">Staffs</p>
//           <Button size="sm" className="w-full lg:w-auto">
//             <PlusIcon className="size-4 mr-2" />
//             New
//           </Button>
//         </div>
//         <DottedSeparator className="my-4" />
//         <DataFilters hideDepartmentFilter={hideDepartmentFilter} />
//         <DottedSeparator className="my-4" />
//         {false ? (
//           <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
//             <Loader className="size-5 animate-spin text-muted-foreground" />
//           </div>
//         ) : (
//           <>
//             <TabsContent value="table" className="mt-0">
//               <DataTable columns={columns} data={[]} />
//             </TabsContent>
//             <TabsContent value="kanban" className="mt-0">

//             </TabsContent>
//             <TabsContent value="calendar" className="mt-0 h-full pb-4">

//             </TabsContent>
//           </>
//         )}
//       </div>
//     </Tabs>
//   );
// };

// export default StaffsPage;

const StaffsPage = () => {
  return <h1>Staff Page</h1>;
};

export default StaffsPage;
