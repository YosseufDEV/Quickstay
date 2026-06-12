interface SkeletonProps {
    className?: string;
    count?: number;
}

const Skeleton = ({ className, count=1 }: SkeletonProps) => {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
        skeletons.push(<div key={i} className={`${className} bg-gray-300 w-full`}/>);
    }

    return skeletons;

}

export default Skeleton;
