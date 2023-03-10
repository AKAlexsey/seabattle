import './Battlefield.css';
import Field from './Field';
import { useState, useEffect, useCallback } from 'react';
import MenuElement from './MenuElement';
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";

import { displayHoveredShip, displayHoveredShipCollision, 
         hoverShipCoordinates, openAllTable, makeShip, tableIsEmpty } from "./fieldManipulationContext"

import { makeDefaultMenuState, closeTileMenu, 
          interactWithTileMenu, changeTileMenuPosition, openTileMenu, 
          hoverShipHideTileMenu, nextMenuState, previousMenuState, 
          setHoveredShip, CLOSED, OPENED, HOVER_SHIP, 
          nullifyHoverTileCoordinates, setHoverTileCoordinates,
          changeHoverShipDirection } from "./editTileMenu"

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

// TODO
// 3. ! Add ability to change direction of the ship using space key
// 4. Add drag and drop
// 1. Fix bug with display collision // later
// 2. Add ability to draw collision in space around

function EditPage() {
  const { state, generateField, addShipOnTable, noHoverShipCollision } = useGlobalContext()

  const { table, shipTemplates } = state;

  const [displayTable, setDisplayTable] = useState(openAllTable(table));
  const [displayMenuState, setDisplayMenuState] = useState(makeDefaultMenuState());
  const { menuState, order, size, direction, x, y } = displayMenuState;

  // Menu state API
  const moveTileMenuElement = (tileX, tileY) => {
    setDisplayMenuState(changeTileMenuPosition(displayMenuState, tileX, tileY));
  }

  const openTileMenuElement = () => {
    setDisplayMenuState(openTileMenu(displayMenuState));
  }

  const interactWithTileMenuElement = () => {
    setDisplayMenuState(interactWithTileMenu(displayMenuState));
  }

  // Display of collision should not be here. 
  // Seems that it cause problem with unable to display collision several times on one tile
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

  const pushButtonCallback = useCallback((event) => {
    if (event.code  === "Escape") {
      setDisplayMenuState(previousMenuState(displayMenuState));
    } else if (
      event.key === " " ||
      event.code === "Space" ||      
      event.keyCode === 32      
    ) {
      setDisplayMenuState(changeHoverShipDirection(displayMenuState));
    }
  }, [direction, x, y]);

  useEffect(() => {
    document.addEventListener("keydown", pushButtonCallback, false);

    // table must not be in this callback variables
    // To avoid infinity loop
    if (menuState === HOVER_SHIP) {
      const { order, size, direction, x, y } = displayMenuState;  
      const newShip = makeShip(order, size, direction, x, y);
      displayHoveredShipOnTable(newShip, false);
    } else {
      setDisplayTable(openAllTable(table));
      return () => {
        document.removeEventListener("keydown", pushButtonCallback, false);
      };
    }
  }, [menuState, order, size, direction, x, y]);

  useEffect(() => {
    // Very ineffective solution, but need to think later
    if (tableIsEmpty(table)) {
      setDisplayTable(openAllTable(table))
    }
  }, [table]);

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
            <ul className='menu_list'>
              {
                shipTemplates.map(({ size, maxShips, shipsPlaced }) => {
                  const menuText = `Ship ${size}. ${shipsPlaced} / ${maxShips}`;
                  const allshipsPlaced = maxShips <= shipsPlaced;
                  return (
                    <li 
                      key={size}
                      className={allshipsPlaced ? 'menu_element all_ships_placed' : 'menu_element'} 
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
