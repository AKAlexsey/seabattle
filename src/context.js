import React, {useState, useContext, useEffect} from 'react'
import {
    addShip,
    moveShip,
    createField,
    makeDefaultField,
    shootTable,
    shootShip,
    hoverShipCoordinates,
    spaceAroundCoordinates,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    SHIP_CONTAINS,
    DEAD_SHIP_CONTAINS
} from "./fieldManipulationContext"

const AppContext = React.createContext()

const LOCAL_STORAGE_NAME = 'seaBattle';

const makeDefaultState = () => {
    const defaultField = makeDefaultField();

    return {...defaultField};
}

const geStateFromLocalStorage = () => {
    const seaBattleState = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (seaBattleState) {
        return JSON.parse(seaBattleState);
    } else {
        return makeDefaultState();
    }
};

const AppProvider = ({children}) => {
    const [state, setState] = useState(geStateFromLocalStorage());

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state))
    }, [state]);

    const openTile = (x, y) => {
        const {width, height, table} = state;

        if (x < 0 || x >= width) {
            console.log(`X is invalid ${x} ${y}`)
            return null;
        }

        if (y < 0 || y >= height) {
            console.log(`Y is invalid ${x} ${y}`)
            return null;
        }

        const newTable = table.map((row, tileY) => {
            if (tileY === y) {
                return row.map((tile, tileX) => {
                    return (tileX === x) ? {...tile, opened: true} : tile
                })
            } else {
                return row;
            }
        })
        setState({...state, table: newTable})
    }

    const generateField = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
        const newField = createField(width, height);

        setState({...state, ...newField});
    }

    const noHoverShipCollision = (newShip) => {
        const {table, width, height} = state;

        const shipCoordinates = hoverShipCoordinates(newShip);

        const coordinatesOutOfField = shipCoordinates.find(({x, y}) => {
            return (x > (width - 1)) || (x < 0) || (y > (height - 1)) || (y < 0);
        })

        if (coordinatesOutOfField) {
            return false;
        }

        let aroundCoordinates = spaceAroundCoordinates(newShip);

        aroundCoordinates = aroundCoordinates.filter(({x, y}) => {
            return (x < width) || (x >= 0) || (y < height) || (y >= 0);
        });

        let allCoordinates = shipCoordinates.concat(aroundCoordinates)

        allCoordinates = allCoordinates.filter(({x, y}) => (x < width) && (x >= 0) && (y < height) && (y >= 0));

        const shipsCollisionsCordinate = allCoordinates.find(({x, y}) => {
            const {contains} = table[y][x];

            return (contains === SHIP_CONTAINS) || (contains === DEAD_SHIP_CONTAINS);
        })

        return (shipsCollisionsCordinate === undefined);
    }

    const addShipOnTable = (newShip) => {
        setState(addShip(state, newShip));
    }

    const moveShipOnTable = (movedShip) => {
        setState(moveShip(state, movedShip));
    }

    const shootTableTile = (_e, x, y) => {
        const {table, ships} = state;
        const {spaceAroundDeadShip, updatedShips} = shootShip(ships, table, x, y);
        const updatedTable = shootTable(table, x, y, spaceAroundDeadShip);

        setState({...state, table: updatedTable, ships: updatedShips})
    }


    return (
        <AppContext.Provider value={{
            state,
            openTile,
            generateField,
            addShipOnTable,
            moveShipOnTable,
            shootTableTile,
            doNothingFunction,
            noHoverShipCollision
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useGlobalContext = () => {
    return useContext(AppContext)
}

const doNothingFunction = (value) => value;

const setEmptyFunctionIfUndefined = (func) => {
    if (func !== undefined) {
        return func;
    } else {
        return doNothingFunction;
    }
};

export {AppContext, AppProvider, useGlobalContext, doNothingFunction, setEmptyFunctionIfUndefined}
