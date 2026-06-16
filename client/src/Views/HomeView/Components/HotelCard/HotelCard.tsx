import styles from "./HotelCard.module.css";
import StarIcon from '@/assets/starIconFilled.svg?react';
import GenericButton from "@/Components/GenericButton/GenericButton";
import Location from "@/Components/Location/Location";

interface HotelProps {
    imageSrc: string,
    location: string,
    name: string,
    pricePerNight: number,
    rating: number,
    isBestSeller?: boolean,
}

const HotelCard = (props: HotelProps) => {
    return (
        <div className={styles.hotelCard}>
            <div className="h-48 relative">
                <img src={props.imageSrc} alt="Hotel Room" className="w-full h-full" /> 
                { props.isBestSeller &&
                <div className="absolute top-3 left-3 text-sm font-[Outfit] text-gray-700 py-0.5 px-2 bg-white rounded-4xl">
                    Best Seller
                </div> }
            </div>
            <div className="px-5 py-4 w-full flex flex-col gap-4 justify-start align-start">
                <div className={`${styles.title} font-normal! text-xl flex-row`}>
                    <p>{props.name}</p>
                    <div className="flex flex-row-reverse gap-1 content-center items-center">
                        <p className="text-sm font-[Inter]">{props.rating}</p>
                        <StarIcon className="w-4"/>
                    </div>
                </div>
                <Location address={props.location} />
                <div className="flex flex-row gap-0.5 justify-between items-center">
                    <div className="flex flex-row gap-0.5 items-center">
                        <p className="text-xl">${props.pricePerNight}</p>
                        <span className="text-[#6B7280] text-sm">/night</span>
                    </div>
                    <GenericButton text="View Details"/>
                </div>
            </div>
        </div>
    )
}

export default HotelCard;
