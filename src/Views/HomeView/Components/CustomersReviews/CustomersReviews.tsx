import CustomerReviewCard from "../CustomerReviewCard/CustomerReviewCard";

const CustomersReviews = () => {
    const reviews = [
        {
            id: 1,
            name: "John Doe",
            pfpSrc: "https://randomuser.me/api/portraits/men/1.jpg",
            rating: 5,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id: 2,
            name: "Jane Doe",
            pfpSrc: "https://randomuser.me/api/portraits/men/5.jpg",
            rating: 4,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id: 3,
            name: "Bob Smith",
            pfpSrc: "https://randomuser.me/api/portraits/men/2.jpg",
            rating: 3,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    ];

    const reviewCards = reviews.map((review) => <CustomerReviewCard { ...review } />);

    return (
        <div className="font-[Outfit] content-container w-full flex flex-col items-center gap-6 py-22!">
            <p className="font-[Playright] text-[36px]">Watch Our Guests Say</p>
            <p className="text-gray-500">Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world.</p>
            <div className="w-full flex flex-row items-center justify-center gap-6">
                {reviewCards}
            </div>
        </div>
    )
}

export default CustomersReviews;
