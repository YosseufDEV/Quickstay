import OfferCard from "../OfferCard/OfferCard"
import OfferImage1 from "@/assets/exclusiveOfferCardImg1.webp"
import OfferImage2 from "@/assets/exclusiveOfferCardImg2.webp"
import OfferImage3 from "@/assets/exclusiveOfferCardImg3.webp"
import AnimatedArrow from "@/Components/AnimatedArrow/AnimatedArrow"
import { useHover } from "@/hooks/customHooks"
import { useRef } from "react"

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

    const arrowParentRef = useRef(null);
    const hovered = useHover(arrowParentRef);

    return (
        <div className="bg-white content-container w-full min-h-[50vh] flex flex-col gap-8 py-25!">
            <div>
                <p className="section-title">Exclusive Offers</p>
                <div className="flex justify-between">
                    <p className="section-description">Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
                    <div className="font-semibold flex items-center gap-1 cursor-pointer" ref={arrowParentRef}>
                        <p>View All Offers</p>
                        <AnimatedArrow color={"black"} hovered={hovered}/>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-between gap-4">
                {offerCards}
            </div>
        </div>
    )
}

export default ExclusiveOffers
