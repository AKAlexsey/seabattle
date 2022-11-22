import './Battlefield.css';
import Field from './Field';
import { useState, useEffect } from 'react';
import MenuElement from './MenuElement';
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";

import { DIRECTION_DOWN, displayHoveredShip, hoverShipCoordinates, openAllTable } from "./fieldManipulationContext"

import { makeMenuState, makeDefaultMenuState, closeTileMenu, interactWithTileMenu, changeTileMenuPosition, openTileMenu, hoverShipHideTileMenu, nextMenuState, previousMenuState, CLOSED, OPENED, INTERACTING, HOVER_SHIP } from "./editTileMenu"

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

function EditPage() {
  const { state, generateField, addShipOnTable } = useGlobalContext()

  const { table } = state;

  const [displayTable, setDisplayTable] = useState(openAllTable(table));
  const [hoveredTileCoordinates, setHoveredTileCoordinates] = useState({ x: null, y: null });
  const [displayMenuState, setDisplayMenuState] = useState(makeDefaultMenuState());
  const { menuState } = displayMenuState;

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
  const displayHoveredShipOnTable = (hoveredShipX, hoveredShipY, direction = DIRECTION_DOWN) => {
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
    setHoveredTileCoordinates({ x, y });
  }

  const pushTileCallback = (_e) => {
    setDisplayMenuState(nextMenuState(displayMenuState))
  }

  useEffect(() => {
    if (menuState === HOVER_SHIP) {
      const { x, y } = hoveredTileCoordinates;
      displayHoveredShipOnTable(x, y);
    } else {
      setDisplayTable(openAllTable(table));
    }
  }, [menuState, hoveredTileCoordinates]);

  return (
    <div className="App">

      <header>
        EditPage
      </header>

      <div className="bobard">
        <Field
          table={displayTable}
          pushTileCallback={pushTileCallback}
          mouseEnterTileCallback={mouseEnterTileCallback}
          mouseMoveTileCallback={mouseMoveTileCallback}
          mouseLeaveFieldCallback={closeTileMenuElement}
        />
      </div>

      <div className='manipulate_section'>
        <button className='btn remove-btn' onClick={() => { generateField() }}>Generate Field</button>
      </div>

      <div className='manipulate_section'>
        <Link className='btn clear-btn' to={`battlefield`}>To the Battlefield!!</Link>
      </div>

      {
        <MenuElement displayMenuState={displayMenuState} >
          <article>
            <ul>
              <li>Menu element #1</li>
              <li>Menu element #2</li>
              <li>Menu element #3</li>
            </ul>
          </article>
        </MenuElement>
      }

    </div>
  );
}

export default EditPage;
