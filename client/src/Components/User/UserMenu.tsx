import { CalendarClock, Settings } from 'lucide-react'
import styles from './UserMenu.module.css'
import IconText from '../IconText/IconText'
import GenericButton from '../GenericButton/GenericButton'
import { useNavigate } from 'react-router'
import useAuthStore from '@/stores/authStore'

const MenuItem = ({ text, onClick, Icon }: { text: string, onClick?: () => void, Icon: any }) => {
    return (
        <div onClick={onClick} className={`${styles.menuItem} hover:bg-gray-100 w-full py-2 px-2 rounded-sm flex flex-row items-start cursor-pointer`}>
            <IconText text={text} Icon={Icon} fontSize={16} textClassName='text-nowrap text-gray-700' iconClassName='stroke-gray-700!' gap={10}/>
        </div>
    )
}

const UserMenu = ({ opened }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore(state => state);

    return (
        opened && 
        <div className={`${styles.userFloatingMenu} bg-white border-gray-300 w-65 gap-4 border rounded-md absolute py-5 px-2 right-0 top-10 flex flex-col items-start justify-start`}>
            <MenuItem text="My Bookings" Icon={CalendarClock} onClick={() => navigate("/my-bookings")} />
            <MenuItem text="Settings" Icon={Settings} />
            <GenericButton text="Log out" className="w-full h-10" onClick={() => logout()} />
        </div>
    )
}

export default UserMenu;
