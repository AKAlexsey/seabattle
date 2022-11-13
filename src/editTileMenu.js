const makeMenuState = ({ opened = false, freeze = false, positionX = 0, positionY = 0 }) => {
    return {
        opened,
        freeze,
        positionX,
        positionY
    };
}

const makeDefaultMenuState = () => {
    return makeMenuState({ opened: false });
}

const changeTileMenuPosition = (x, y) => {
    return { positionX: x, positionY: y, opened: true };
}

const closeTileMenu = () => {
    return { opened: false };
}

const freezeTileMenu = () => {
    return { freeze: true };
}

const unfreezeTileMenu = () => {
    return { freeze: false };
}

// Probably not necessary
const openTileMenu = () => {
    return { opened: true };
}

export { makeDefaultMenuState, makeMenuState, openTileMenu, closeTileMenu, changeTileMenuPosition, freezeTileMenu, unfreezeTileMenu }
