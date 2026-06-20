import FilledStarIcon from "@/assets/starIconFilled.svg?react";
import Star from "@/assets/starIconFilled.svg";
import OutlinedStarIcon from "@/assets/starIconOutlined.svg?react";
import { StarIcon } from "lucide-react";

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
    const color = category.iconFillClass.split(":")[1].replace("fill", "color").replace("!", "");

    console.log(color);

    for(let i = 0; i < 5; i++) {
        i < Math.round(rating) ? 
            stars.push(<FilledStarIcon className={`${iconClass} ${categorized && category.iconFillClass} ${categorized && category.iconStrokeClass}`} key={i} />) : 
            stars.push(
                // <div className={ `flex justify-start relative` } style={{ mask: `url(/src/assets/starIconOutlined.svg) center/contain no-repeat`, }} key={i}>
                //     <div style={{ width: `${(5-rating)*100/5 + 25}%`,  background: `var(--${color})`, }} className="absolute inset-0 z-500 w-full h-full"/>
                    <OutlinedStarIcon className={`${iconClass} ${categorized && category.iconStrokeClass}`} key={i} />
                // </div>
        )
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
