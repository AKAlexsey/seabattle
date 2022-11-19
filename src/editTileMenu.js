const makeMenuState = ({ tileMenuOpened = false, freeze = false, positionX = 0, positionY = 0 }) => {
    return {
        tileMenuOpened,
        freeze,
        positionX,
        positionY
    };
}

const makeDefaultMenuState = () => {
    return makeMenuState({ tileMenuOpened: false });
}

const changeTileMenuPosition = (state, x, y) => {
    return { ...state, positionX: x, positionY: y, tileMenuOpened: true };
}

const closeTileMenu = (state) => {
    return { ...state, tileMenuOpened: false };
}

const freezeTileMenu = (state) => {
    return { ...state, freeze: true };
}

const unfreezeTileMenu = (state) => {
    return { ...state, freeze: false };
}

// Probably not necessary
const openTileMenu = (state) => {
    return { ...state, tileMenuOpened: true };
}

export { makeDefaultMenuState, makeMenuState, openTileMenu, closeTileMenu, changeTileMenuPosition, freezeTileMenu, unfreezeTileMenu }
