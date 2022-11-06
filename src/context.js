import React, { useState, useContext, useEffect } from 'react'
import { field } from './data'

const AppContext = React.createContext()

const localStorageName = 'seaBattle';

const defaultState = {...field};

const geStateFromLocalStorage = () => {
    const seaBattleState = localStorage.getItem(localStorageName);
    if (seaBattleState) {
      return JSON.parse(seaBattleState);
    } else {
      return defaultState;
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

    const resetState = () => {
        setState(defaultState);
    }

    return (
        <AppContext.Provider value={{ state, openCell, resetState }} >
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }
