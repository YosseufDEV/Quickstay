import Skeleton from "@/Components/Skeleton/Skeleton";

// TODO: Add skeleton for room section
const SkeletonHotelView = () => {
  return (
        <div className="bg-[#fdfdfd] content-container min-h-screen flex w-full flex-col gap-5">
                <Skeleton height={32} widths={[60]} />
                <Skeleton height={32} widths={[600]} />
                <Skeleton count={2} className="h-8" widths={[290, 220]}/>

                <div className="grid grid-cols-[auto_auto_auto] grid-rows-2 items-stretch w-fit gap-x-5 gap-y-4">
                    <Skeleton className="w-150! aspect-3/2! row-span-2" />
                    <Skeleton count={4} className="w-70! aspect-3/2!" />
                </div>
                <Skeleton className="py-13 px-20 w-full!" />
                <Skeleton className="h-8 w-120! mb-10" />
                <div className="w-full flex gap-7 flex-col content-container items-center justify-center">
                    <Skeleton className="h-8 w-120!" />
                    <div className="flex items-center justify-start gap-7">
                        <Skeleton count={4} className="h-90 w-70!" />
                    </div>
                </div>
        </div>
    )
}

export default SkeletonHotelView;
