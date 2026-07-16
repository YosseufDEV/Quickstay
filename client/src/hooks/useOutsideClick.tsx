export function useOutsideClick(ref: React.RefObject<HTMLElement>[], callback: () => void) {
    if (!ref || ref.length === 0) return;
    console.log(ref)

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.every(r => r.current && !r.current.contains(event.target as Node))) {
            callback();
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
}
