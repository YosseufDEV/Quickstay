import styles from './Hero.module.css';

const Hero = () => {
    const description = <p className="text-white">Unparalleled luxury and comfort await at the world's most exclusive <br /> hotels and resorts. Start your journey today.</p>

    return (
        <div className={`${styles.hero} h-min-full content-container`}>
            <div className={styles.tag}>
                <p>The Ultimate Hotel Experience</p>
            </div>
            <div className={styles.infoContainer}>
                <p className={styles.title}>Discover Your Perfect Gateway Destination</p>
                {description}
            </div>
        </div>
    )
}

export default Hero;
