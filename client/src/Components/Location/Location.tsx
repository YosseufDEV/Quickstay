import LocationPinIcon from "@/assets/locationIcon.svg?react";    

const Location = ({ address }: { address: string }) => {
    return (
        <div className="w-fit flex gap-1.5 justify-center items-center text-gray-500 text-sm">
            <LocationPinIcon className="w-[1.25em] h-[1.25em]"/>
            <p>{address}</p> 
        </div> 
    )
}

export default Location;
