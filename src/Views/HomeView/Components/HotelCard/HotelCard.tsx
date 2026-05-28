import styles from "./HotelCard.module.css";
import LocationPinIcon from '../../../../assets/locationIcon.svg?react';
import StarIcon from '../../../../assets/starIconFilled.svg?react';

interface HotelProps {
    imageSrc: string,
    location: string,
    name: string,
    pricePerNight: number,
    rating: number,
}

const HotelCard = (props: HotelProps) => {
    return (
        <div className={styles.hotelCard}>
            <div className="h-48">
                <img src={props.imageSrc} alt="Hotel Room" className="w-full h-full" />
            </div>
            <div className="px-5 py-4 w-full flex flex-col gap-4 justify-start align-start">
                <div className={`${styles.title} text-xl`}>
                    <p>{props.name}</p>
                    <div className={styles.rating}>
                        <p>{props.rating}</p>
                        <StarIcon />
                    </div>
                </div>
                <div className={`${styles.location} text-sm`}>
                    <p>{props.location}</p> 
                    <LocationPinIcon />
                </div>
                <div className="flex flex-row gap-0.5 justify-start items-center">
                    <p className="text-xl">${props.pricePerNight}</p>
                    <span className="text-[#6B7280] text-sm">/night</span>
                </div>
            </div>
        </div>
    )
}

export default HotelCard;
