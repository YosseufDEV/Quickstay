import HotelCard from '../HotelCard/HotelCard';
import styles from './FeaturedDestination.module.css';

import HotelImage1 from "../../../../assets/roomImg1.png";
import HotelImage2 from "../../../../assets/roomImg2.png";
import HotelImage3 from "../../../../assets/roomImg3.png";
import HotelImage4 from "../../../../assets/roomImg4.png"

import GenericButton from '@/Components/GenericButton/GenericButton';

const FeaturedDestination = () => {
    const description = <p className="section-description text-center">Discover our handpicked selection of exceptional properties around the world, offering<br/>unparalleled luxury and unforgettable experiences.</p>;
    const hotels = [
        {
            location: "Paris, France",
            name: "Hotel Le Meurice",
            pricePerNight: 1200,
            rating: 4.8,
            imageSrc: HotelImage1,
            isBestSeller: true,
        },
        {
            location: "Maldives",
            name: "Soneva Jani",
            pricePerNight: 2500,
            rating: 4.9,
            imageSrc: HotelImage2,
            isBestSeller: false,
        },
        {
            location: "Kyoto, Japan",
            name: "Hoshinoya Kyoto",
            pricePerNight: 900,
            rating: 4.7,
            imageSrc: HotelImage3,
            isBestSeller: true,
        },
        {
            location: "New York, USA",
            name: "The Plaza Hotel",
            pricePerNight: 1500,
            rating: 4.6,
            imageSrc: HotelImage4,
            isBestSeller: false,
        },
    ]

    const hotelCards = hotels.map((hotel, index) => (
        <HotelCard 
            key={index}
            location={hotel.location}
            name={hotel.name}
            pricePerNight={hotel.pricePerNight}
            rating={hotel.rating}
            imageSrc={hotel.imageSrc}
            isBestSeller={hotel.isBestSeller}
        />
    ));

    return (
        <div className={styles.featuredDestination}>
            <div className={`${styles.info} content-container`}>
                <p className="section-title">Featured Destination</p>
                {description}
            </div>
            <div className={styles.cardContainer}>
                {hotelCards}
            </div>
            <div className="font-medium text-[#6B7280]">
                <GenericButton text="View All Hotels" />
            </div>
        </div>
    )
}

export default FeaturedDestination;
