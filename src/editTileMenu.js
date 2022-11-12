const makeMenuState = ({ opened = false, stationary = false, positionX = 0 , positionY = 0}) => {
    return {
        opened,
        stationary,
        positionX,
        positionY,
    };
}

const makeDefaultMenuState = () => {
    return makeMenuState({ opened: true });
}

const setMenuOpened = (opened, state) => {
    return { ...state, opened };
}

const setStationary = (stationary, state) => {
    return { ...state, stationary };
}

const setMenuPosition = (positionX, positionY, state) => {
    return { ...state, positionX, positionY };
}

export { makeDefaultMenuState, makeMenuState, setMenuOpened, setStationary, setMenuPosition }
