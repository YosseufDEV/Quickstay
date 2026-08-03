import DatePicker from '@/Components/DatePicker/DatePicker';
import styles from './Hero.module.css';
import { useState } from 'react';

const Hero = () => {
    const description = <p className="text-white">Unparalleled luxury and comfort await at the world's most exclusive <br /> hotels and resorts. Start your journey today.</p>
    const [range, setRange] = useState({ from: null, to: null });
    const [destination, setDestination] = useState<string>(null);

    return (
        <div className={`${styles.hero} min-h-screen! ignore-safe-area-top content-container`}>
            <div className={styles.tag}>
                <p>The Ultimate Hotel Experience</p>
            </div>
            <div className={`${styles.infoContainer} mb-20`}>
                <p className={styles.title}>Discover Your Perfect Gateway Destination</p>
                {description}
            </div>
            <DatePicker searchCallback={() => console.log("Searched") } withDestination destination={destination} setDestination={setDestination} range={range} setRange={setRange} />
        </div>
    )
}

export default Hero;
