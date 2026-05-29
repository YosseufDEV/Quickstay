import OfferCard from "../OfferCard/OfferCard"
import OfferImage1 from "@/assets/exclusiveOfferCardImg1.png"
import OfferImage2 from "@/assets/exclusiveOfferCardImg2.png"
import OfferImage3 from "@/assets/exclusiveOfferCardImg3.png"
import AnimatedArrow from "@/Components/AnimatedArrow/AnimatedArrow"

const ExclusiveOffers = () => {
    const offers = [
        {
            title: "Summer Escape Package",
            description: "Enjoy a complimentary night and daily breakfast",
            expiry: "Aug 31",
            src: OfferImage1,
            discount: 25
        },
        {
            title: "Romantic Getaway",
            description: "Special couples package including spa treatment",
            expiry: "Sep 20",
            src: OfferImage2,
            discount: 20
        },
        {
            title: "Luxury Retreat",
            description: "Book 60 days in advance and save on your stay at any of our luxury properties worldwide.",
            expiry: "Sep 25",
            src: OfferImage3,
            discount: 30
        }
    ]

    const offerCards = offers.map((offer, index) => 
        <OfferCard
            key={index} 
            title={offer.title}
            description={offer.description}
            expiry={offer.expiry}
            discount={offer.discount}
            imgSrc={offer.src}
        />)

    return (
        <div className="content-container w-full min-h-[50vh] flex flex-col gap-8">
            <div>
                <p className="text-[36px]">Exclusive Offers</p>
                <div className="flex justify-between">
                    <p className="text-gray-500">Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
                    <AnimatedArrow text={"View All Offers"} color={"black"}/>
                </div>
            </div>
            <div className="flex w-full justify-between gap-4">
                {offerCards}
            </div>
        </div>
    )
}

export default ExclusiveOffers
