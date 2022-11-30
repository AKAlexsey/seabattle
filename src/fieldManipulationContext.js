const EMPTY_CONTAINS = 'empty'
const MISS_SHOT_CONTAINS = 'miss_shot'
const SHIP_CONTAINS = 'ship'
const DEAD_SHIP_CONTAINS = 'dead_ship'
const HOVERED_CONTAINS = 'hovered_ship'
const HOVERED_COLLISION_CONTAINS = 'hovered_ship_collision' // probably not necessary
const OVERLAPSE_CONTAINS = 'overlapse_ship'

const CLOSED_TILE_CLASS = 'closed'

const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;

const DIRECTION_UP = 'up';
const DIRECTION_RIGHT = 'right';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';

const emptyTile = { opened: false, contains: EMPTY_CONTAINS, shipId: null, collision: false };
const emptyField = {
    height: 0,
    width: 0,
    table: [[]],
    shipTemplates: [],
    ships: []
};

const makeShipTempalte = (size = 1, maxShips = 1) => {
    return { size, maxShips, shipsPlaced: 0 }
}

const defaultShipTempaltes = [
    makeShipTempalte(1, 4),
    makeShipTempalte(2, 3),
    makeShipTempalte(3, 2),
    makeShipTempalte(4, 1),
]

const makeShip = (order, size, direction, positionX, positionY) => {
    return {
        id: `ID_${order}_${size}`,
        hoverShipCoordinates: hoverShipCoordinates({ size, direction, positionX, positionY }),
        size,
        positionX,
        positionY,
        direction,
        alive: true
    }
}

const createField = (height, width) => {
    const generatedTable = Array(height).fill().map(() => Array(width).fill(emptyTile));
    return {
        ...emptyField,
        height: height,
        width: width,
        table: generatedTable,
        shipTemplates: defaultShipTempaltes,
        ships: []
    };
}

const makeDefaultField = () => {
    return createField(DEFAULT_WIDTH, DEFAULT_HEIGHT);
}

const addShip = (state, newShip) => {
    const { id, hoverShipCoordinates, size } = newShip
    const { table, ships, shipTemplates } = state;

    const updatedTable = tableElementsMap(table, (tile, tableX, tableY) => {
        if (hoverShipCoordinates.find(({ x, y }) => tableX === x && tableY === y)) {
            return { ...tile, shipId: id, contains: SHIP_CONTAINS }
        } else {
            return tile
        }
    })

    const updatedShipTempaltes = placeShipFromTemplate(shipTemplates, size);

    return { ...state, table: updatedTable, ships: [...ships, newShip], shipTemplates: updatedShipTempaltes }
}

const placeShipFromTemplate = (shipTempaltes, addedShipSize) => {
    return shipTempaltes.map((shipTemplate) => {
        const { size, shipsPlaced } = shipTemplate;
        if (size === addedShipSize) {
            return { ...shipTemplate, shipsPlaced: (shipsPlaced + 1) }
        } else {
            return shipTemplate;
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

const shootTable = (table, x, y, spaceAroundDeadShip) => {
    const shootingCoordinates = spaceAroundDeadShip.concat({ x, y })

    return tableElementsMap(table, (tile, tableX, tableY) => {
        if (shootingCoordinates.find(({ x, y }) => x === tableX && y === tableY )) {
            const { contains } = tile;
            const newContains = getAfterShopContains(contains);
            return { ...tile, contains: newContains, opened: true };
        } else {
            return tile;
        }
    })
}

// Awesome !!! single responsibility for table and ship
const shootShip = (ships, table, shootX, shootY) => {
    const { shipId } = table[shootY][shootX];

    if (shipId === null) {
        return { spaceAroundDeadShip: [], updatedShips: ships };
    }

    const ship = ships.find(({ id }) => id === shipId);
    const { hoverShipCoordinates } = ship;

    const updatedCoordinates = hoverShipCoordinates.map((coordinates) => {
        const { x, y } = coordinates;

        if (x === shootX && y === shootY) {
            return { ...coordinates, alive: false }
        } else {
            return coordinates;
        }
    });

    const currentAliveStatus = updatedCoordinates.every(({ alive }) => alive);

    const updatedShips = ships.map((ship) => {
        if (ship.id === shipId) {
            return { ...ship, hoverShipCoordinates: updatedCoordinates, alive: currentAliveStatus };
        } else {
            return ship;
        }
    });

    if (currentAliveStatus === false) {
        const spaceAroundDeadShip = spaceAroundCoordinates(ship);
        return { spaceAroundDeadShip, updatedShips };
    } else {
        return { spaceAroundDeadShip: [], updatedShips };
    }
};

const getAfterShopContains = (contains) => {
    if (contains === SHIP_CONTAINS || contains === DEAD_SHIP_CONTAINS) {
        return DEAD_SHIP_CONTAINS;
    } else {
        return MISS_SHOT_CONTAINS;
    };
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
        shipMask.push({ ...newElement, alive: true });
    }

    return shipMask;
}

const spaceAroundCoordinates = (ship) => {
    const hoveredShipCoordinates = hoverShipCoordinates(ship);

    let coordinates = [];

    for (const { x, y } of hoveredShipCoordinates) {
        coordinates = coordinates.concat(aroundCoordinates(x, y));
    }

    coordinates = uniqueArray(coordinates);

    return coordinates.filter((el) => { return !hoveredShipCoordinates.includes(el) });
}

const uniqueArray = (arr) => {
    return arr.filter((value, index, self) => {
        return self.indexOf(value) === index;
    })
}

const aroundCoordinates = (x, y) => {
    let coordinates = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            coordinates.push({ x: (x + i), y: (y + j) });
        }
    }

    return coordinates;
}

const displayHoveredShip = (table, hoveredShipCoordinates) => {
    return tableElementsMap(table, (tile, tableX, tableY) => {
        if (hoveredShipCoordinates.find(({ x, y }) => x === tableX && y === tableY)) {
            const { shipId } = tile;
            if (shipId !== null) {
                return { ...tile, contains: OVERLAPSE_CONTAINS };
            } else {
                return { ...tile, contains: HOVERED_CONTAINS };
            }
        } else {
            return tile;
        }
    })
}

const displayHoveredShipCollision = (table, hoveredShipCoordinates) => {
    return tableElementsMap(table, (tile, tableX, tableY) => {
        if (hoveredShipCoordinates.find(({ x, y }) => x === tableX && y === tableY)) {
            const { shipId } = tile;
            if (shipId !== null) {
                return { ...tile, contains: OVERLAPSE_CONTAINS, collision: true };
            } else {
                return { ...tile, contains: HOVERED_CONTAINS, collision: true };
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


// const shipTemplate = {
//     size: [1 - 4],
//     shipsCount: 1 - 4,
//     shipsInstalled: 0-shipCount
// }

export {
    addShip,
    makeShip,
    hoverShipCoordinates,
    displayHoveredShip,
    displayHoveredShipCollision,
    spaceAroundCoordinates,
    makeDefaultField,
    createField,
    openAllTable,
    shootTable,
    shootShip,

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
    HOVERED_COLLISION_CONTAINS,
    OVERLAPSE_CONTAINS
}

