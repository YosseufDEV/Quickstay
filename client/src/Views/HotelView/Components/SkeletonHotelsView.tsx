import Skeleton from "@/Components/Skeleton/Skeleton";
import { ScrollRestoration } from "react-router";

// TODO: Add skeleton for room section
const SkeletonHotelView = () => {
  return (
        <div className="bg-[#fdfdfd] content-container h-screen flex w-fit flex-col gap-5">
                <Skeleton className="h-8" widths={[60]} />
                <Skeleton className="h-8" widths={[600]} />
                <Skeleton count={2} className="h-8 w-80!" />

                <div className="grid grid-cols-[auto_auto_auto] grid-rows-2 items-stretch w-fit gap-x-5 gap-y-4">
                    <Skeleton className="w-150! aspect-3/2 row-span-2" />
                    <Skeleton count={4} className="w-70! aspect-3/2" />
                </div>
                <Skeleton className="h-8 w-120!" />
        </div>
    )
}

export default SkeletonHotelView;
