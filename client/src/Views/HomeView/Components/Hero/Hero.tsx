import styles from './Hero.module.css';

const Hero = () => {
    const description = <p className="text-white">Unparalleled luxury and comfort await at the world's most exclusive <br /> hotels and resorts. Start your journey today.</p>

    return (
        // HACK: -mt-30 is a hack to make the hero section take up the full height of the screen, since the header is fixed and takes up some space.
        <div className={`${styles.hero} min-h-screen! ignore-safe-area-top content-container`}>
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
