import { useRef, useEffect } from 'react'
import { useGlobalContext } from './context'

const MenuElement = ({ children, displayMenuState }) => {
    const { tileMenuOpened, positionX, positionY } = displayMenuState;
    const container = useRef(null);

    useEffect(() => {
        const menu = container.current

        menu.style.left = `${positionX}px`
        menu.style.top = `${positionY}px`
    }, [displayMenuState]);

    return (
        <div
            className={`${tileMenuOpened ? 'menu_element_container opened' : 'menu_element_container'}`}
            ref={container}
        >
            {children}
        </div>
    );
}

export default MenuElement