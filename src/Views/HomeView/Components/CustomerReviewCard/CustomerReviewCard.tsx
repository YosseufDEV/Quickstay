import StarsRating from "@/Components/StarsRating/StarsRating";

interface CustomerReviewCardProps {
    name: string;
    pfpSrc: string;
    rating: number;
    review: string;
}

const CustomerReviewCard = (props: CustomerReviewCardProps) => {
    return (
        <div className="p-10 max-w-110 rounded-2xl bg-white shadow-md flex flex-col items-start content-between gap-4">
            <div className="flex flex-row items-center justify-center gap-3">
                <img src={props.pfpSrc} alt={`${props.name}'s profile picture`} className="w-11 h-11 rounded-full" />
                <p className="text-xl font-[Playright]">{props.name}</p>
            </div>
            <StarsRating rating={props.rating} />
            <p className="font-[Outfit] text-gray-500">"{props.review}"</p>
        </div>
    )
}

export default CustomerReviewCard;
