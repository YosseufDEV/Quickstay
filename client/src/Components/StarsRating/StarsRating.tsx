import FilledStarIcon from "@/assets/starIconFilled.svg?react";
import OutlinedStarIcon from "@/assets/starIconOutlined.svg?react";

const ratings = {
    low: {
        textClass: "text-red-800 bg-red-200",
        iconStrokeClass: "[&_path]:stroke-red-400!",
        iconFillClass: "[&_path]:fill-red-400!",
    },
    average: {
        textClass: "text-yellow-800 bg-yellow-200",
        iconStrokeClass: "[&_path]:stroke-yellow-500!",
        iconFillClass: "[&_path]:fill-yellow-500!",
    },
    high: {
        textClass: "text-emerald-800 bg-emerald-200",
        iconStrokeClass: "[&_path]:stroke-emerald-400!",
        iconFillClass: "[&_path]:fill-emerald-400!",
    }
}

const StarsRating = ({ rating, showRating, categorized }: { rating: number, showRating?: boolean, categorized?: boolean }) => {
    const stars = [];
    const ratingCategory = rating <= 2 ? "low" : rating <= 4 ? "average" : "high";
    const category = ratings[ratingCategory];
    const iconClass = `w-[1.5em] h-[1.5em]`;

    for(let i = 0; i < 5; i++) {
        i < rating ? 
            stars.push(<FilledStarIcon className={`${iconClass} ${categorized && category.iconFillClass} ${categorized && category.iconStrokeClass}`} key={i} />) : 
            stars.push(<OutlinedStarIcon className={`${iconClass} ${categorized && category.iconStrokeClass}`} key={i} />)
    }

    // TODO: Fractional stars for ratings like 3.5
    return (
        <div className="flex  flex-row font-[Outfit] text-sm items-center gap-2.5">
            <div className="flex flex-row items-center gap-1.5" style={{}}>
                {stars}
            </div>
            { showRating &&
                <div className={ `font-medium ${category.textClass} rounded-lg py-px px-3` }>
                    <p>{rating.toFixed(1)}</p>
                </div>
            }
        </div>
    )
}

export default StarsRating;
