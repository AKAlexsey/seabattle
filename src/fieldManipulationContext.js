const EMPTY_CONTAINS = 'empty'
const MISS_SHOT_CONTAINS = 'miss_shot'
const SHIP_CONTAINS = 'ship'
const DEAD_SHIP_CONTAINS = 'dead_ship'

const createField = (height, width) => {
    const emptyField = { opened: false, contains: EMPTY_CONTAINS, shipId: null };
    const generatedTable = Array(height).fill().map(() => Array(width).fill(emptyField));
    return {
        height: height,
        width: width,
        table: generatedTable
    };
}

const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;

const makeDefaultField = () => {
    return createField(DEFAULT_WIDTH, DEFAULT_HEIGHT);
}

const addShip = (table, x, y, shipId) => {
    return iterateTable(table, (tile, tableX, tableY) => {
        if (tableX === x && tableY === y) {
            return { ...tile, shipId: shipId, contains: SHIP_CONTAINS }
        } else {
            return tile
        }
    })
}

const openAllTable = (table) => {
    return iterateTable(table, (tile, tableX, tableY) => {
        return { ...tile, opened: true }
    })
}

const iterateTable = (table, iterator) => {
    return table.map((row, tableY) => {
        return row.map((tile, tableX) => {
            return iterator(tile, tableX, tableY)
        })
    })
}

const shootTable = (table, x, y) => {
    return iterateTable(table, (tile, tableX, tableY) => {
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

const shipCellCoordinates = {
    x: 1,
    y: 1,
    alive: [true, false]
}

const ship = {
    size: [1,4],
    id: "Id_1",
    occupied_cells: [shipCellCoordinates, shipCellCoordinates],
    positionX: [0-10],
    positionY: [0-10],
    direction: ['top','right','down','left'],
    alive: [true, false]
}

const shipsCollection = [
    ship,
    ship
]

export { addShip, makeDefaultField, createField, DEFAULT_WIDTH, DEFAULT_HEIGHT, openAllTable, shootTable }
