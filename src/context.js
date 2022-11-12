import React, { useState, useContext, useEffect } from 'react'
import { addShip, createField, shootTable, makeDefaultField, DEFAULT_WIDTH, DEFAULT_HEIGHT,  }  from "./FieldManipulationContext"

const AppContext = React.createContext()

const localStorageName = 'seaBattle';

const makeDefaultState = () => {
    const defaultField = makeDefaultField();

    return { ...defaultField };
}

const geStateFromLocalStorage = () => {
    const seaBattleState = localStorage.getItem(localStorageName);
    if (seaBattleState) {
      return JSON.parse(seaBattleState);
    } else {
      return makeDefaultState();
    }
  };

const AppProvider = ({ children }) => {
    const [state, setState] = useState(geStateFromLocalStorage());

    useEffect(() => {
        localStorage.setItem(localStorageName, JSON.stringify(state))
    }, [state]);

    const openCell = (x, y) => {
        const { width, height, table } = state;

        if (x < 0 || x >= width) {
            console.log(`X is invalid ${x} ${y}`)
            return null;
        }

        if (y < 0 || y >= height) {
            console.log(`Y is invalid ${x} ${y}`)
            return null;
        }

        const newTable = table.map((row, cellY) => {
            if (cellY === y) {
                return row.map((cell, cellX) => {
                    return (cellX === x) ? { ...cell, opened: true } : cell
                })
            } else {
                return row;
            }
        })
        setState({ ...state, table: newTable })
    }

    const generateField = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
        console.log({ width, height })
        const newField = createField(width, height);
        console.log({ newField })

        setState({ ...state, ...newField });
    }

    const addShipOnTable = (x, y) => {
        const { table } = state;
        const updatedTable = addShip(table, x, y , `randomId_234`)

        setState({ ...state, table: updatedTable })
    }

    const shootTableCell = (x, y) => {
        const { table } = state;
        const updatedTable = shootTable(table, x, y)
        setState({ ...state, table: updatedTable })
    }


    return (
        <AppContext.Provider value={{ state, openCell, generateField, addShipOnTable, shootTableCell }} >
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }
