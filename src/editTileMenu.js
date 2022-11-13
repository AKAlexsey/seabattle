const makeMenuState = ({ opened = false, activated = false, positionX = 0, positionY = 0 }) => {
    return {
        opened,
        positionX,
        positionY,
        activated
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

// Probably not necessary
const openTileMenu = () => {
    return { opened: true };
}

export { makeDefaultMenuState, makeMenuState, openTileMenu, closeTileMenu, changeTileMenuPosition }
