import HotelCard from '../HotelCard/HotelCard';
import styles from './FeaturedDestination.module.css';

import HotelImage1 from "../../../../assets/roomImg1.png";
import HotelImage2 from "../../../../assets/roomImg2.png";
import HotelImage3 from "../../../../assets/roomImg3.png";
import HotelImage4 from "../../../../assets/roomImg4.png"

const FeaturedDestination = () => {
    const description = "Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.";
    const hotels = [
        {
            location: "Paris, France",
            name: "Hotel Le Meurice",
            pricePerNight: 1200,
            rating: 4.8,
            imageSrc: HotelImage1,
        },
        {
            location: "Maldives",
            name: "Soneva Jani",
            pricePerNight: 2500,
            rating: 4.9,
            imageSrc: HotelImage2,
        },
        {
            location: "Kyoto, Japan",
            name: "Hoshinoya Kyoto",
            pricePerNight: 900,
            rating: 4.7,
            imageSrc: HotelImage3,
        },
        {
            location: "New York, USA",
            name: "The Plaza Hotel",
            pricePerNight: 1500,
            rating: 4.6,
            imageSrc: HotelImage4,
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
        />
    ));

    return (
        <div className={styles.featuredDestination}>
            <div className={`${styles.info} content-container`}>
                <p className={styles.title}>Featured Destination</p>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.cardContainer}>
                {hotelCards}
            </div>
        </div>
    )
}

export default FeaturedDestination;
