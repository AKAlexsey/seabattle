const EMPTY_CONTAINS = 'empty'
const MISS_SHOT_CONTAINS = 'miss_shot'
const SHIP_CONTAINS = 'ship'
const DEAD_SHIP_CONTAINS = 'dead_ship'
const HOVERED_CONTAINS = 'hovered_ship'
const OVERLAPSE_CONTAINS = 'overlapse_ship'

const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;

const DIRECTION_UP = 'up';
const DIRECTION_RIGIHT = 'right';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';

const emptyField = { opened: false, contains: EMPTY_CONTAINS, shipId: null };

const createField = (height, width) => {
    const generatedTable = Array(height).fill().map(() => Array(width).fill(emptyField));
    return {
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
            return { ...tile, contains: newContains };
        } else {
            return tile;
        }
    })
}

// Filters
const openAllTable = (table) => {
    return tableElementsMap(table, (tile, tableX, tableY) => {
        return { ...tile, opened: true }
    })
}

const hoverShip = (table, ship) => {
    const { id, size, positionX, positionY, direction } = ship;
    const shipCoordinates = calculateShipCoordinates(size, positionX, positionY, direction);
    return tableElementsMap(table, (tile, tableX, tableY) => {
        if (shipCoordinates.find(({x, y}) => x === tableX && y === tableY )) {
            const { shipId, contains } = tile;
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

const calculateShipCoordinates = (size, positionX, positionY, direction) => {
    const directionIterator = getDirectionIterator(direction);

    let shipMask = [{ positionX, positionY }];

    for (let i = 0; i < size - 1; i++) {
        // if (i === 0) { 
        //     shipMask.push({positionX, positionY})
        // } else { 
        const lastElement = shipMask[shipMask.length - 1];
        const newElement = directionIterator(lastElement);
        shipMask.push(newElement);
        // }
    }

    return shipMask;
}

const getDirectionIterator = (direction) => {
    switch (direction) {
        case DIRECTION_UP:
            return ({ x, y }) => { x, y - 1 }
        case DIRECTION_DOWN:
            return ({ x, y }) => { x, y + 1 }
        case DIRECTION_RIGIHT:
            return ({ x, y }) => { x + 1, y }
        case DIRECTION_LEFT:
            return ({ x, y }) => { x - 1, y }
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



export { addShip, hoverShip, makeDefaultField, createField, DEFAULT_WIDTH, DEFAULT_HEIGHT, openAllTable, shootTable, DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGIHT  }


// EMPTY_CONTAINS
// MISS_SHOT_CONTAINS
// SHIP_CONTAINS
// DEAD_SHIP_CONTAINS
// HOVERED_CONTAINS
// OVERLAPSE_CONTAINS
