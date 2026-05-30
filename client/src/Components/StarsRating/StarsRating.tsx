import FilledStarIcon from "@/assets/starIconFilled.svg?react";
import OutlinedStarIcon from "@/assets/starIconOutlined.svg?react";

const StarsRating = ({ rating }: { rating: number }) => {
    const stars = [];

    for(let i = 0; i < 5; i++) {
        i < rating ? stars.push(<FilledStarIcon key={i} />) : stars.push(<OutlinedStarIcon key={i} />)
    }

    return (
        <div className="flex flex-row items-center gap-1.5">
            {stars}
        </div>
    )
}

export default StarsRating;
