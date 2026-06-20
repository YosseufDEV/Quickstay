import Logo from "@/assets/logo.svg?react"
import ArrowIcon from "@/assets/arrowIcon.svg?react"
import InstagramIcon from "@/assets/instagramIcon.svg?react";
import FacebookIcon from "@/assets/facebookIcon.svg?react";
import TwitterIcon from "@/assets/twitterIcon.svg?react";
import LinkedInIcon from "@/assets/linkendinIcon.svg?react";
import styles from "./Footer.module.css"
import { NavLink } from "react-router";


interface FooterSectionProps {
    items: string[];
    title?: string;
}

const FooterSection = (props: FooterSectionProps) => {
    return (
        <div className="flex flex-col gap-4">
        { props.title &&
            <h3 className="text-xl font-Playfair text-black">{props.title.toUpperCase()}</h3>
        }
            <ul className="flex flex-col gap-2 text-sm font-[Inter] *:text-[#6B7280]! *:no-underline! *:font-normal!">
                { props.items.map((item: string, index: number) => <NavLink key={index} to={`/${item}`}><li>{item}</li></NavLink>) }
            </ul>
        </div>
    )
}

const Footer = () => {
    const description = "Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands."
    return (
        <footer className="content-container mt-15 bg-footerBackground w-full flex flex-col">
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

                <FooterSection title="Company" items={["About", "Careers", "Press", "Blog", "Partners"]} />

                <FooterSection title="Support" items={["Help Center", "Cancellation Options", "Neighborhood Support", "Trust & Safety", "Contact Us"]} />

                <div className="flex flex-col gap-4">
                    <h1 className="font-Playfair text-xl text-black">STAY UPDATED</h1>
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
                <ul className="flex flex-row gap-4">
                    <li>Privacy</li>
                    <li>Terms</li>
                    <li>Sitemap</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;
