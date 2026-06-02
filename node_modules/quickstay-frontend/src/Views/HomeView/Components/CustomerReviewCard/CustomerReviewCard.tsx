import StarsRating from "@/Components/StarsRating/StarsRating";

interface CustomerReviewCardProps {
    name: string;
    pfpSrc: string;
    rating: number;
    review: string;
}

const CustomerReviewCard = (props: CustomerReviewCardProps) => {
    return (
        <div className="px-5 py-8 max-w-110 rounded-xl border-gray-100 border bg-white shadow-sm flex flex-col items-start content-between gap-5">
            <div className="flex flex-row items-center justify-center gap-3">
                <img src={props.pfpSrc} alt={`${props.name}'s profile picture`} className="w-12 h-12 rounded-full" />
                <p className="text-xl font-[Playright]">{props.name}</p>
            </div>
            <StarsRating rating={props.rating} />
            <p className="font-[Outfit] text-gray-500">"{props.review}"</p>
        </div>
    )
}

export default CustomerReviewCard;
