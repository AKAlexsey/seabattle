import './Battlefield.css';
import Field from './Field';
import { useState, useEffect } from 'react';
import MenuElement from './MenuElement';
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";

import { DIRECTION_DOWN, displayHoveredShip, hoverShipCoordinates, openAllTable, makeShip } from "./fieldManipulationContext"

import { makeMenuState, makeDefaultMenuState, closeTileMenu, interactWithTileMenu, changeTileMenuPosition, openTileMenu, hoverShipHideTileMenu, nextMenuState, previousMenuState, setHoveredShip, CLOSED, OPENED, INTERACTING, HOVER_SHIP, nullifyHoverTileCoordinates, setHoverTileCoordinates } from "./editTileMenu"

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

function EditPage() {
  const { state, generateField, addShipOnTable } = useGlobalContext()

  const { table, shipTemplates } = state;

  const [displayTable, setDisplayTable] = useState(openAllTable(table));
  const [displayMenuState, setDisplayMenuState] = useState(makeDefaultMenuState());
  const { menuState, order, size, direction, x, y } = displayMenuState;

  // Menu state API
  const closeTileMenuElement = () => {
    setDisplayMenuState(closeTileMenu(displayMenuState));
  }

  const moveTileMenuElement = (x, y) => {
    setDisplayMenuState(changeTileMenuPosition(displayMenuState, x, y));
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
  const displayHoveredShipOnTable = (hoveredShipX, hoveredShipY, order, size, direction = DIRECTION_DOWN) => {
    const ship = makeShip(order, size, direction, hoveredShipX, hoveredShipY);

    const hoveredSipCoordinates = hoverShipCoordinates(ship);

    const newDisplayTableValue = displayHoveredShip(openAllTable(table), hoveredSipCoordinates);

    setDisplayTable(newDisplayTableValue);
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
      addShipOnTable(order, size, direction, x, y);
    }
    setDisplayMenuState(nextMenuState(displayMenuState));
  }

  const mouseLeaveFieldCallback = (e) => {
    setDisplayMenuState(closeTileMenu(nullifyHoverTileCoordinates(displayMenuState)));
  }

  const selectedMenuElementCallback = (order, size) => {
    const udpatedState = setHoveredShip(displayMenuState, order, size);
    setDisplayMenuState(hoverShipHideTileMenu(udpatedState));
  }

  useEffect(() => {
    // table must not be in this callback variables
    // To avoid infinity loop
    if (menuState === HOVER_SHIP) {
      const { x, y } = displayMenuState;
      displayHoveredShipOnTable(x, y, order, size, direction);
    } else {
      setDisplayTable(openAllTable(table));
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
