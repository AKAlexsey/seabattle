import { DIRECTION_DOWN, nextShipDirection } from './fieldManipulationContext.js'

const CLOSED = 'tile_menu_closed'
const OPENED = 'tile_menu_opened'
const INTERACTING = 'tile_menu_interacting'
const HOVER_SHIP = 'tile_menu_hover_ship'

export {
    CLOSED,
    OPENED,
    INTERACTING,
    HOVER_SHIP
}


const makeMenuState = ({ menuState = CLOSED, positionX = 0, positionY = 0 }) => {
    return {
        menuState: HOVER_SHIP,
        positionX: 0,
        positionY: 0,
        size: 1,
        order: 1,
        direction: 'down',
        x: null, 
        y: null
    };
}

const makeDefaultMenuState = () => {
    return makeMenuState({});
}

const changeTileMenuPosition = (state, positionX, positionY) => {
    return { ...state, positionX, positionY };
}

const openTileMenu = (state) => {
    return { ...state, menuState: OPENED };
}

const closeTileMenu = (state) => {
    return { ...state, menuState: CLOSED };
}

const interactWithTileMenu = (state) => {
    return { ...state, menuState: INTERACTING };
}

const hoverShipHideTileMenu = (state) => {
    return { ...state, menuState: HOVER_SHIP };
}

const setHoveredShip = (state, order, size, direction = DIRECTION_DOWN) => {
    return { ...state, order, size, direction };
}

const setHoverTileCoordinates = (state, x, y) => {
    return { ...state, x, y };
}

const nullifyHoverTileCoordinates = (state) => {
    return { ...state, x: null, y: null };
}

// Probably not necessary

const MENU_STATES = [CLOSED, OPENED, INTERACTING, HOVER_SHIP]

const nextMenuState = (currentState) => {
    const { menuState } = currentState;
    const nextStepIndex = MENU_STATES.findIndex(stateConstant => stateConstant === menuState) + 1
    if (nextStepIndex === MENU_STATES.length) {
        return { ...currentState, menuState: MENU_STATES[0] };
    } else {
        return { ...currentState, menuState: MENU_STATES[nextStepIndex] };
    }
}

const previousMenuState = (currentState) => {
    const { menuState } = currentState;
    const previousStepIndex = MENU_STATES.findIndex(stateConstant => stateConstant === menuState) - 1
    if (previousStepIndex === -1) {
        return currentState;
    } else {
        return { ...currentState, menuState: MENU_STATES[previousStepIndex] };
    }
}

const changeHoverShipDirection = (currentState) => {
    const { menuState, direction } = currentState;

    if (menuState === HOVER_SHIP) {
        const nextDirection = nextShipDirection(direction);
        return { ...currentState, direction: nextDirection };
    } else {
        return currentState;
    }
}

export { makeDefaultMenuState, makeMenuState, 
    openTileMenu, closeTileMenu, interactWithTileMenu, 
    changeTileMenuPosition, nextMenuState, previousMenuState, 
    hoverShipHideTileMenu, setHoveredShip, nullifyHoverTileCoordinates, 
    setHoverTileCoordinates, changeHoverShipDirection }
