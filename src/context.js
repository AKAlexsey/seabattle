import React, { useState, useContext, useEffect } from 'react'
import {
    addShip, createField, makeDefaultField, shootTable, DEFAULT_WIDTH, DEFAULT_HEIGHT, openTile
} from "./fieldManipulationContext"

const AppContext = React.createContext()

const LOCAL_STORAGE_NAME = 'seaBattle';

const makeDefaultState = () => {
    const defaultField = makeDefaultField();

    return { ...defaultField };
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

    const openTileElement = (x, y) => {
        setState(openTile(state, x, y));
    }

    const generateField = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
        const newField = createField(width, height);

        setState({ ...state, ...newField });
    }

    const addShipOnTable = (x, y) => {
        setState(addShip(state, x, y));
    }

    const shootTableTileElement = (x, y) => {
        setState(shootTable(state, x, y));
    }


    return (
        <AppContext.Provider value={{
            state,
            openTileElement,
            generateField,
            addShipOnTable,
            shootTableTileElement,
            doNothingFunction,
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
