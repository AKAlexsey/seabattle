import React, { useState, useContext, useEffect } from 'react'
import { addShip, createField, shootTable, makeDefaultField, DEFAULT_WIDTH, DEFAULT_HEIGHT,  }  from "./fieldManipulationContext"
import { makeDefaultMenuState, setMenuOpened, setStationary, setMenuPosition  }  from "./editTileMenu"

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

    const setMenuElementOpened = (opened) => {
        const updatedMenuOpenedState = setMenuOpened(opened, state);
        console.log({ opened, updatedMenuOpenedState })
        setState(updatedMenuOpenedState)
    }
 
    const setMenuElementPosition = (x, y) => {
        const updatedMenuPositionState = setMenuPosition(x, y, state);
        setState(updatedMenuPositionState)
    }


    return (
        <AppContext.Provider value={{ 
            state, 
            openTile, 
            generateField, 
            addShipOnTable, 
            shootTableTile, 
            setMenuElementOpened, 
            setMenuElementPosition 
        }} >
            {children}
        </AppContext.Provider>
    )
}

const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider, useGlobalContext }
