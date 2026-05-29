import Logo from "@/assets/logo.svg?react"
import ArrowIcon from "@/assets/arrowIcon.svg?react"
import InstagramIcon from "@/assets/instagramIcon.svg?react";
import FacebookIcon from "@/assets/facebookIcon.svg?react";
import TwitterIcon from "@/assets/twitterIcon.svg?react";
import LinkedInIcon from "@/assets/linkendinIcon.svg?react";
import styles from "./Footer.module.css"

const Footer = () => {
    const description = "Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands."

    return (
        <footer className="content-container bg-[#f6f9fc] w-full flex flex-col">
            <div className="flex justify-between  w-full py-8 pt-3">
                <div className={styles.siteInfo}>
                    <Logo className="fill-black"/>
                    <p className="text-sm max-w-[320px] font-[Inter] text-[#6B7280]">{description}</p>
                    <div className={`${styles.socialMedia} flex items-center gap-4`}>
                        <InstagramIcon />
                        <FacebookIcon />
                        <TwitterIcon />
                        <LinkedInIcon />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-[Playfair] text-black">COMPANY</h3>
                    <ul className="flex flex-col gap-2 text-sm font-[Inter] text-[#6B7280]">
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Press</li>
                        <li>Blog</li>
                        <li>Partners</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-[Playfair] text-black">SUPPORT</h3>
                    <ul className="flex flex-col gap-2 text-sm font-[Inter] text-[#6B7280]">
                        <li>Help Center</li>
                        <li>Safety Information</li>
                        <li>Cancellation Options</li>
                        <li>Contact Us</li>
                        <li>Accessibility</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="text-lg text-gray-800">STAY UPDATED</p>
                    <p className="max-w-90 text-sm text-gray-500">Subscribe to our newsletter for travel inspiration and special offers.</p>
                    <form className="flex items-center justify-start">
                        <input className={styles.submitInput} placeholder="Your email"/>
                        <button className={styles.submitButton}>
                            <ArrowIcon />
                        </button>
                    </form>
                </div>
            </div>
            <hr className="border-gray-500"/>
            <div className="py-5 flex justify-between w-full font-[Outfit] text-gray-500">
                <p>© 2026 QuickStay. All rights reserved.</p>
                <ul className="flex gap-4">
                    <li>Privacy</li>
                    <li>Terms</li>
                    <li>Sitemap</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;

