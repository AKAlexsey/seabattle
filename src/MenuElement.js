import { useRef, useEffect } from 'react'
import { useGlobalContext } from './context'

const MenuElement = ({ children }) => {
    const { state: { opened, positionX, positionY } } = useGlobalContext();
    const container = useRef(null);

    useEffect(() => {
        const menu = container.current

        menu.style.left = `${positionX}px`
        menu.style.top = `${positionY}px`
    }, [opened, positionX, positionY]);

    return (
        <div
            className={`${opened ? 'menu_element_container opened' : 'menu_element_container'}`}
            ref={container}
        >
            {children}
        </div>
    );
}

export default MenuElement