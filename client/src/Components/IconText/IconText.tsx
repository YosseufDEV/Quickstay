interface IconTextProps {
    Icon: React.ElementType;
    text: string;
    iconSize?: number;
    fontSize?: number;
    textColor?: string;
    iconColor?: string;
    gap?: number;
    iconClassName?: string;
    textClassName?: string;
    containerClassName?: string;
}

const IconText = ({ Icon, text, iconSize=1.5, fontSize=12, textColor, gap=8, iconColor, iconClassName, textClassName, containerClassName }: IconTextProps) => {
    return ( 
        <div style={{ fontSize: `${fontSize}px`, gap: `${gap}px` }} className={`${containerClassName} flex flex-row items-center`}>
            <Icon className={`${iconClassName}`} style={{ width: `${iconSize}em`, height: `${iconSize}em`, stroke: iconColor }} />
            <p className={`${textClassName}`} style={{ color: textColor }}>{text}</p>
        </div>
    )
}

export default IconText;
