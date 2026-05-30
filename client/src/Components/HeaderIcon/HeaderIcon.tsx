interface HeaderIconProps {
    Icon: any;
    size?: number;
}


const HeaderIcon = ({ Icon, size=29 }: HeaderIconProps) => {
    const style = {
        width: size,
        height: size,
    }

    return (
        <div>
            <Icon className="header-icon" style={style}/>
        </div>
    )
}

export default HeaderIcon;
