

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

const addShip = (table, x, y, shipId) => {
    return iterateTable(table, (cell, tableX, tableY) => {
        if (tableX === x && tableY === y) {
            return { ...cell, shipId: shipId, contains: SHIP_CONTAINS }
        } else {
            return cell
        }
    })
}

const openAllTable = (table) => {
    return iterateTable(table, (cell, tableX, tableY) => {
        return { ...cell, opened: true }
    })
}

const iterateTable = (table, iterator) => {
    return table.map((row, tableY) => {
        return row.map((cell, tableX) => {
            return iterator(cell, tableX, tableY)
        })
    })
}

const shootTable = (table, x, y) => {
    return iterateTable(table, (cell, tableX, tableY) => {
        if (tableX === x && tableY === y) {
            // Need to send shipId to some observer to display is ship still alive.
            const { contains } = cell;
            const newContains = contains === SHIP_CONTAINS ? DEAD_SHIP_CONTAINS : MISS_SHOT_CONTAINS;
            return { ...cell, contains: newContains };
        } else {
            return cell;
        }
    })
}



export { addShip, createField, openAllTable, shootTable }
