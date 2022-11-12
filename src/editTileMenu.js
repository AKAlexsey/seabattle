const makeMenuState = ({ opened = false, positionX = 0, positionY = 0 }) => {
    return {
        opened,
        positionX,
        positionY,
    };
}

const makeDefaultMenuState = () => {
    return makeMenuState({ opened: false });
}

const openTileMenu = (positionX, positionY, state) => {
    return {
        ...state,
        positionX,
        positionY, opened: true
    };
}

const closeTileMenu = (state) => {
    return {
        ...state,
        opened: false
    };
}

export { makeDefaultMenuState, makeMenuState, openTileMenu, closeTileMenu }
