const EMPTY_CONTAINS = 'empty'
const MISS_SHOT_CONTAINS = 'miss_shot'
const SHIP_CONTAINS = 'ship'
const DEAD_SHIP_CONTAINS = 'dead_ship'
const HOVERED_CONTAINS = 'hovered_ship'
const OVERLAPSE_CONTAINS = 'overlapse_ship'

const CLOSED_TILE_CLASS = 'closed'

const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;

const DIRECTION_UP = 'up';
const DIRECTION_RIGHT = 'right';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';

const emptyTile = { opened: false, contains: EMPTY_CONTAINS, shipId: null };
const emptyField = {
    height: 0,
    width: 0,
    table: [[]],
    hoveredSipCoordinates: []
};

const createField = (height, width) => {
    const generatedTable = Array(height).fill().map(() => Array(width).fill(emptyTile));
    return {
        ...emptyField,
        height: height,
        width: width,
        table: generatedTable
    };
}

const makeDefaultField = () => {
    return createField(DEFAULT_WIDTH, DEFAULT_HEIGHT);
}

const addShip = (table, x, y, shipId) => {
    return tableElementsMap(table, (tile, tableX, tableY) => {
        if (tableX === x && tableY === y) {
            return { ...tile, shipId: shipId, contains: SHIP_CONTAINS }
        } else {
            return tile
        }
    })
}

// Map function must be 3 arity. Second and third argument are indexes of iterated tiles.
const tableElementsMap = (table, iterator) => {
    return table.map((row, tableY) => {
        return row.map((tile, tableX) => {
            return iterator(tile, tableX, tableY)
        })
    })
}

const shootTable = (table, x, y) => {
    return tableElementsMap(table, (tile, tableX, tableY) => {
        if (tableX === x && tableY === y) {
            // Need to send shipId to some observer to display is ship still alive.
            const { contains } = tile;
            const newContains = contains === SHIP_CONTAINS ? DEAD_SHIP_CONTAINS : MISS_SHOT_CONTAINS;
            return { ...tile, contains: newContains, opened: true };
        } else {
            return tile;
        }
    })
}

// Filters
const openAllTable = (table) => {
    return tableElementsMap(table, (tile, _tableX, _tableY) => {
        return { ...tile, opened: true }
    })
}

const hoverShipCoordinates = (ship) => {
    const { positionX, positionY, direction, size } = ship;
    const directionIterator = getDirectionIterator(direction);

    let shipMask = [{ x: positionX, y: positionY }];

    for (let i = 0; i < size - 1; i++) {
        const lastElement = shipMask[shipMask.length - 1];
        const newElement = directionIterator(lastElement);
        shipMask.push(newElement);
    }

    return shipMask;
}

const displayHoveredShip = (table, hoveredSipCoordinates) => {
    return tableElementsMap(table, (tile, tableX, tableY) => {
        if (hoveredSipCoordinates.find(({ x, y }) => x === tableX && y === tableY)) {
            const { shipId } = tile;
            if (shipId !== null) {
                return { ...tile, contains: HOVERED_CONTAINS };
            } else {
                return { ...tile, contains: OVERLAPSE_CONTAINS };
            }
        } else {
            return tile;
        }
    })
}

const getDirectionIterator = (direction) => {
    switch (direction) {
        case DIRECTION_UP:
            return ({ x, y }) => {
                return { x, y: (y - 1) };
            }
        case DIRECTION_DOWN:
            return ({ x, y }) => {
                return { x, y: (y + 1) };
            }
        case DIRECTION_RIGHT:
            return ({ x, y }) => {
                return { x: (x + 1), y };
            }
        case DIRECTION_LEFT:
            return ({ x, y }) => {
                return { x: (x - 1), y };
            }
        default:
            console.log(`Get direction Iterator unexpected direction ${direction}`);
            return;
    };
}

const shipCellCoordinates = {
    x: 1,
    y: 1,
    alive: [true, false]
}

const ship = {
    size: [1, 4],
    id: "Id_1",
    occupied_cells: [shipCellCoordinates, shipCellCoordinates],
    positionX: [0 - DEFAULT_WIDTH],
    positionY: [0 - DEFAULT_HEIGHT],
    direction: ['top', 'right', 'down', 'left'],
    alive: [true, false]
}

const shipsCollection = [
    ship,
    ship
]



export {
    addShip,
    hoverShipCoordinates,
    displayHoveredShip,
    makeDefaultField,
    createField,
    openAllTable,
    shootTable,

    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,

    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,

    CLOSED_TILE_CLASS,

    EMPTY_CONTAINS,
    MISS_SHOT_CONTAINS,
    SHIP_CONTAINS,
    DEAD_SHIP_CONTAINS,
    HOVERED_CONTAINS,
    OVERLAPSE_CONTAINS
}

