import HeroImage from "../assets/heroImage.png"

const HomeView = () => {
    return (
        <div className="w-full h-full">
            <img src={HeroImage} className="h-full w-full" />
            <div className="h-50 w-50">
                Secondary Div
            </div>
        </div>
    );
}

export default HomeView;
