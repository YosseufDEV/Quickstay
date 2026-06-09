import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonHotelCard = () => {
    return (
        <SkeletonTheme baseColor="#000000" highlightColor="#444444">
            <div className="font-[Inter] w-full flex flex-row justify-start items-center gap-10 mb-20">
                    {/* <img className="w-90 h-fit rounded-xl" src={props.imageSrc} /> */}
                    <Skeleton width={360} height={240} containerClassName="flex-1" />

                    <div className= "flex flex-col grow gap-3 h-full justify-between">
                        <Skeleton containerClassName="flex-1" count={5} />
                    </div>
            </div>
        </SkeletonTheme >
    )
}

export default SkeletonHotelCard;
