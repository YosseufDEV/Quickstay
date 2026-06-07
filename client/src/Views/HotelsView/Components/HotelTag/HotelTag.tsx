interface HotelTagProps {
    text: string;
    Icon: any;
    iconClass?: string;
}

const HotelTag = (props: HotelTagProps) => {
    return (
        <div className="py-2 px-2 items-center justify-center bg-gray-100 text-black flex gap-2 rounded-md">
            <props.Icon className={ `[&_path]:fill-black w-6 ${props.iconClass}` }/>
            <p className="text-sm font-[Inter] w-full">{props.text}</p>
        </div>
    )
}

export default HotelTag;
