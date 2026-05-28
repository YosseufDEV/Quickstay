import styles from './Hero.module.css';

const Hero = () => {
    const description = "Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.";

    return (
        <div className={styles.hero}>
            <div className={styles.tag}>
                <p>The Ultimate Hotel Experience</p>
            </div>
            <div className={styles.infoContainer}>
                <p className={styles.title}>Discover Your Perfect Gateway Destination</p>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    )
}

export default Hero;
