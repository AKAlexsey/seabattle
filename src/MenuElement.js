import { useRef, useEffect } from 'react'
import { useGlobalContext } from './context'
import { OPENED, CLOSED } from "./editTileMenu"

const MenuElement = ({ children, displayMenuState }) => {
    const { menuState, positionX, positionY } = displayMenuState;
    const container = useRef(null);

    useEffect(() => {
        const menu = container.current

        if (menuState === OPENED || menuState === CLOSED) {
            menu.style.left = `${positionX}px`
            menu.style.top = `${positionY}px`
        }
    }, [menuState, positionX, positionY]);

    return (
        <div
            className={`${menuState === OPENED ? 'menu_element_container opened' : 'menu_element_container'}`}
            ref={container}
        >
            {children}
        </div>
    );
}

export default MenuElement