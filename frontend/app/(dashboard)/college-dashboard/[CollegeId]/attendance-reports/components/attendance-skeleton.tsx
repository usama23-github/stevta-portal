export default function AttendanceSkeleton() {

    return (

        <div className="space-y-3">

            {Array.from({ length: 10 }).map((_, i) => (

                <div

                    key={i}

                    className="h-14 animate-pulse rounded-lg bg-slate-100"

                />

            ))}

        </div>

    );

}