import Skeleton from "@/Components/Skeleton/Skeleton";

const SkeletonHotelCard = ({ count=1 }: { count?: number}) => {
    
   const element =  
    <>
        <div className="w-full h-fit flex relative flex-row gap-10 items-stretch justify-start">
            {/* <img className="w-90 h-fit rounded-xl" src={props.imageSrc} /> */}
            <Skeleton className="w-90! max-h-full! aspect-3/2 shrink-0 rounded-xl" />

            <div className="w-full flex flex-col justify-between gap-3">
                <Skeleton className="w-full h-6 rounded-lg" widths={[150, 260, 280, 200, 450, 100]} count={6} />
            </div>
        </div>
        <hr />
    </>

    const elements = [];

    for(let i = 0; i < count; i++) {
        elements.push(element);
    }

    return elements;

}

export default SkeletonHotelCard;
