

const EMPTY_CONTAINS = 'empty'
const MISS_SHOT_CONTAINS = 'miss_shot'
const SHIP_CONTAINS = 'ship'

const generateField = (height, width) => {
    const emptyField = {opened: false, contains: EMPTY_CONTAINS, shipId: null};
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
            return { ...cell, shipId: shipId, contains: SHIP_CONTAINS}
        } else {
            return cell
        }
    })
}

const openTable = (table) => {
    return iterateTable(table, (cell, tableX, tableY) => {
        return { ...cell, opened: true}
    })
}

const iterateTable = (table, iterator) => {
    table.map((row, tableY) => {
        row.map((cell, tableX) => {
            iterator(cell, tableX, tableY)
        })
    })
}



export { generateField, addShip, openTable }