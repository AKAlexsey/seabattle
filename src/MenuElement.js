import { useRef, useEffect } from 'react'
import { useGlobalContext } from './context'
import { OPENED, CLOSED, INTERACTING, HOVER_SHIP } from "./editTileMenu"

const MenuElement = ({ children, displayMenuState, hoverMenuCallback }) => {
    const { menuState, positionX, positionY } = displayMenuState;
    const container = useRef(null);

    const getMenuClasses = (menuState) => {
        switch(menuState) {
            case OPENED:
                return 'menu_element_container opened';
                break;
            case INTERACTING:
                return 'menu_element_container opened interacting';
                break;
            default:
                return 'menu_element_container';
        }
    }

    useEffect(() => {
        const menu = container.current

        if (menuState !== HOVER_SHIP) {
            menu.style.left = `${positionX}px`
            menu.style.top = `${positionY}px`
        }
    }, [menuState, positionX, positionY]);

    return (
        <div
            onMouseEnter={hoverMenuCallback}
            className={getMenuClasses(menuState)}
            ref={container}
        >
            {children}
        </div>
    );
}

export default MenuElement