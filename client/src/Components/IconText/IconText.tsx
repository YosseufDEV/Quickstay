interface IconTextProps {
    Icon: React.ElementType;
    text: string;
    iconSize: number;
    fontSize?: number;
    textColor?: string;
    iconColor?: string;
    iconClassName?: string;
    textClassName?: string;
    containerClassName?: string;
}

const IconText = ({ Icon, text, iconSize, fontSize=12, textColor, iconColor, iconClassName, textClassName, containerClassName }: IconTextProps) => {
    return ( 
        <div style={{ fontSize: `${fontSize}px` }} className={`${containerClassName} flex flex-row items-center gap-2`}>
            <Icon className={`${iconClassName}`} style={{ width: `${iconSize}em`, height: `${iconSize}em`, stroke: iconColor }} />
            <p className={`${textClassName}`} style={{ color: textColor }}>{text}</p>
        </div>
    )
}

export default IconText;
