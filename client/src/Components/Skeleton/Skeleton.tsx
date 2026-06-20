interface SkeletonProps {
    className?: string;
    count?: number;
    widths?: number[];
}

const Skeleton = ({ className, count=1, widths=[] }: SkeletonProps) => {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
        if(widths.length < i) {
            widths.push(0);
        }

        skeletons.push(<div key={i} style={{ width: widths[i] ? `${widths[i]}px` : "100%" }} className={`${className} bg-gray-300 animate-pulse w-full rounded-md`}/>);
    }

    return skeletons;

}

export default Skeleton;
