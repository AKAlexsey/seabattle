import './Battlefield.css';
import Field from './Field';
import { useState, useEffect, useCallback } from 'react';
import MenuElement from './MenuElement';
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";

import { DIRECTION_DOWN, displayHoveredShip, displayHoveredShipCollision, hoverShipCoordinates, openAllTable, makeShip } from "./fieldManipulationContext"

import { makeDefaultMenuState, closeTileMenu, 
          interactWithTileMenu, changeTileMenuPosition, openTileMenu, 
          hoverShipHideTileMenu, nextMenuState, previousMenuState, 
          setHoveredShip, CLOSED, OPENED, HOVER_SHIP, 
          nullifyHoverTileCoordinates, setHoverTileCoordinates } from "./editTileMenu"

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

function EditPage() {
  const { state, generateField, addShipOnTable, noHoverShipCollision } = useGlobalContext()

  const { table, shipTemplates } = state;

  const [displayTable, setDisplayTable] = useState(openAllTable(table));
  const [displayMenuState, setDisplayMenuState] = useState(makeDefaultMenuState());
  const { menuState, order, size, direction, x, y } = displayMenuState;

  // Menu state API
  const closeTileMenuElement = () => {
    setDisplayMenuState(closeTileMenu(displayMenuState));
  }

  const moveTileMenuElement = (tileX, tileY) => {
    setDisplayMenuState(changeTileMenuPosition(displayMenuState, tileX, tileY));
  }

  const openTileMenuElement = () => {
    setDisplayMenuState(openTileMenu(displayMenuState));
  }

  const interactWithTileMenuElement = () => {
    setDisplayMenuState(interactWithTileMenu(displayMenuState));
  }

  // const toggleDisplayHoverShip = () => {
  //   setDisplayHoverShip(!hoverShip)
  // }

  // Display table API
  const displayHoveredShipOnTable = (ship, collision) => {
    const hoveredShipCoordinates = hoverShipCoordinates(ship);

    const openedTable = openAllTable(table);

    if (collision) {
      setDisplayTable(displayHoveredShipCollision(openedTable, hoveredShipCoordinates));
    } else {
      setDisplayTable(displayHoveredShip(openedTable, hoveredShipCoordinates));
    }
  }

  // Callbacks
  const mouseMoveTileCallback = (e) => {
    if (menuState === OPENED || menuState === CLOSED) {
      const positionX = e.pageX + MENU_ELEMENT_MOUSE_DISTANCE;
      const positionY = e.pageY + MENU_ELEMENT_MOUSE_DISTANCE;
      moveTileMenuElement(positionX, positionY);
    }
  }

  const mouseEnterTileCallback = (_e, x, y) => {
    setDisplayMenuState(setHoverTileCoordinates(displayMenuState, x, y));
  }

  const pushTileCallback = (_e) => {
    if (menuState === HOVER_SHIP) {
      const { order, size, direction, x, y } = displayMenuState;
      const newShip = makeShip(order, size, direction, x, y);

      if (noHoverShipCollision(newShip)) {
        addShipOnTable(newShip);
        setDisplayMenuState(nextMenuState(displayMenuState));
      } else {
        displayHoveredShipOnTable(newShip, true);
      }
    } else {
      setDisplayMenuState(nextMenuState(displayMenuState));
    }
  }

  const mouseLeaveFieldCallback = (e) => {
    setDisplayMenuState(closeTileMenu(nullifyHoverTileCoordinates(displayMenuState)));
  }

  const selectedMenuElementCallback = (order, size) => {
    const udpatedState = setHoveredShip(displayMenuState, order, size);
    setDisplayMenuState(hoverShipHideTileMenu(udpatedState));
  }

  const escFunction = useCallback((event) => {
    setDisplayMenuState(previousMenuState(displayMenuState))
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    // table must not be in this callback variables
    // To avoid infinity loop
    if (menuState === HOVER_SHIP) {
      const { order, size, direction, x, y } = displayMenuState;  
      const newShip = makeShip(order, size, direction, x, y);
      displayHoveredShipOnTable(newShip, false);
    } else {
      setDisplayTable(openAllTable(table));
      return () => {
        document.removeEventListener("keydown", escFunction, false);
      };
    }
  }, [menuState, order, size, direction, x, y]);

  return (
    <div className="App">

      <header className='edit_header'>
        <span>
          EditPage
        </span>

        <span>
          <button className='btn remove-btn' onClick={() => { generateField() }}>Generate Field</button>
        </span>
        
      </header>



      <div className="bobard">
        <Field
          table={displayTable}
          pushTileCallback={pushTileCallback}
          mouseEnterTileCallback={mouseEnterTileCallback}
          mouseMoveTileCallback={mouseMoveTileCallback}
          mouseLeaveFieldCallback={mouseLeaveFieldCallback}
        />
      </div>

      <div className='manipulate_section'>
        <Link className='btn clear-btn' to={`battlefield`}>To the Battlefield!!</Link>
      </div>

      {
        <MenuElement displayMenuState={displayMenuState} hoverMenuCallback={interactWithTileMenuElement} >
          <article>
            <ul>
              {
                shipTemplates.map(({ size, maxShips, shipsPlaced }) => {
                  const menuText = `Ship ${size}. ${maxShips}/${shipsPlaced}`;
                  const allshipsPlaced = maxShips <= shipsPlaced;
                  return (
                    <li 
                      key={size}
                      className={allshipsPlaced ? 'all_ships_placed' : ''} 
                      onMouseDown={() => { return allshipsPlaced ? () => {} : selectedMenuElementCallback(shipsPlaced, size) }}
                    >
                      {menuText}
                    </li>
                  );
                })
              }
            </ul>
          </article>
        </MenuElement>
      }

    </div>
  );
}

export default EditPage;
