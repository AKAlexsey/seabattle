import React, { useState, useContext, useEffect } from 'react'
import { addShip, hoverShip, createField, openAllTable, makeDefaultField, shootTable , DIRECTION_DOWN, DEFAULT_WIDTH, DEFAULT_HEIGHT, hoverShipCoordinates, 
    displayHoveredShip}  from "./fieldManipulationContext"
import { makeDefaultMenuState, closeTileMenu, changeTileMenuPosition }  from "./editTileMenu"

const AppContext = React.createContext()

const LOCAL_STORAGE_NAME = 'seaBattle';

const makeDefaultState = () => {
    const defaultField = makeDefaultField();
    const defaultMenuState = makeDefaultMenuState();

    return { ...defaultField, ...defaultMenuState };
}

const geStateFromLocalStorage = () => {
    const seaBattleState = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (seaBattleState) {
      return JSON.parse(seaBattleState);
    } else {
      return makeDefaultState();
    }
  };

const AppProvider = ({ children }) => {
    const [state, setState] = useState(geStateFromLocalStorage());

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state))
    }, [state]);

    const openTile = (x, y) => {
        const { width, height, table } = state;

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
                    return (tileX === x) ? { ...tile, opened: true } : tile
                })
            } else {
                return row;
            }
        })
        setState({ ...state, table: newTable })
    }

    const generateField = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
        const newField = createField(width, height);

        setState({ ...state, ...newField });
    }

    const addShipOnTable = (x, y) => {
        const { table } = state;
        const updatedTable = addShip(table, x, y , `randomId_234`)

        setState({ ...state, table: updatedTable })
    }

    const shootTableTile = (x, y) => {
        const { table } = state;
        const updatedTable = shootTable(table, x, y)
        setState({ ...state, table: updatedTable })
    }
 
    const closeTileMenuElement = () => {
        const updatedTileMenuParams = closeTileMenu()
        setState({ ...state, ...updatedTileMenuParams });
    }
 
    const moveTileMenuElement = (x, y) => {
        const updatedTileMenuParams = changeTileMenuPosition(x, y)
        setState({ ...state, ...updatedTileMenuParams });
    }

    const openTable = (state) => {
        const { table } = state;
        const openedTable = openAllTable(table)
        return { ...state, table: openedTable };
    }

    const setHoveredShipCoordinates = (hoveredShipX, hoveredShipY, direction = DIRECTION_DOWN) => {
        const ship = {
            size: 3,
            id: "Id_1",
            occupied_cells: [],
            positionX: hoveredShipX,
            positionY: hoveredShipY,
            direction: direction,
            alive: null
        }

        const hoveredSipCoordinates = hoverShipCoordinates(ship);
        return { ...state, hoveredSipCoordinates: hoveredSipCoordinates };
    }

    const clearHoveredShipCoordinates = () => {
        return { ...state, hoveredSipCoordinates: [] }
    }

    return (
        <AppContext.Provider value={{ 
            state, 
            openTile, 
            generateField, 
            addShipOnTable, 
            shootTableTile, 
            closeTileMenuElement,
            moveTileMenuElement,
            openTable,
            doNothingFunction,
            setHoveredShipCoordinates,
            clearHoveredShipCoordinates,
        }} >
            {children}
        </AppContext.Provider>
    )
}

const useGlobalContext = () => {
    return useContext(AppContext)
}

const doNothingFunction = (value) => value;

export { AppContext, AppProvider, useGlobalContext, doNothingFunction }
