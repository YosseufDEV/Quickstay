import Skeleton from "@/Components/Skeleton/Skeleton"

const SkeletonBookingView = () => {
    return (
        <div className="grid grid-cols-[1fr_1fr] min-h-screen w-screen">
            <div className="p-10 flex flex-col gap-5">
                <Skeleton count={3} height={35} containerClassName="mb-10" widths={[50, 450, 150]}/>
                <Skeleton count={2} height={35} widths={[50, 350]}/>
                <Skeleton count={2} containerClassName="mb-10" orientation="horizontal" height={35}/>

                <Skeleton count={2} height={35} widths={[50, 350]}/>
                <Skeleton count={3} height={35} />
            </div>
            <div className="flex justify-start flex-col p-10 gap-10 w-full">
                <Skeleton count={2} heights={[750, 50]} gap={40} className="w-full"/>
            </div>
        </div>
    )
}

export default SkeletonBookingView
