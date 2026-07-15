import { FileSearch } from "lucide-react";

export default function AttendanceEmpty() {

    return (

        <div className="py-20 text-center">

            <FileSearch className="mx-auto h-12 w-12 text-slate-400" />

            <h3 className="mt-5 text-xl font-semibold">

                No Attendance Found

            </h3>

            <p className="mt-2 text-slate-500">

                Try changing filters

            </p>

        </div>

    );

}