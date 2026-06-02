import { useId } from "react";
import styles from "./Checkbox.module.css";

const Checkbox = () => {
    const id = useId();

    return (
        <div className="font-[Inter] flex items-center justify-start w-fit">
            <input type="checkbox" id={id} className={`${styles.checkbox} bg-blue`}/>
            <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900">Remember me</label>
        </div>
    )
}

export default Checkbox;
