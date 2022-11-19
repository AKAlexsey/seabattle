import './Battlefield.css';
import Field from './Field';
import { useState, useEffect } from 'react';
import MenuElement from './MenuElement';
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";
import Spinner from './Spinner'

import { DIRECTION_DOWN, displayHoveredShip, hoverShipCoordinates, openAllTable } from "./fieldManipulationContext"

import { makeDefaultMenuState, closeTileMenu, changeTileMenuPosition, openTileMenu } from "./editTileMenu"

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

function EditPage() {
  const { state, generateField, addShipOnTable } = useGlobalContext()

  const { table } = state;

  const [displayTable, setDisplayTable] = useState(openAllTable(table));
  const [displayHoverShip, setDisplayHoverShip] = useState(false);
  const [hoveredTileCoordinates, setHoveredTileCoordinates] = useState({ x: null, y: null });
  const [displayMenuState, setDisplayMenuState] = useState(makeDefaultMenuState());

  // Refactoring
  // 1. Extract everything related to hovered ship into separated module

  // Further steps
  // 1. Create adding hovered ship (Including validation that ship does not hover and there are no ships around and it's inside the field)
  //    (probably in editTileMenu and rename it to shipsEdigMenu)
  //    1.1. Add ability to change direction of ship using keys and space
  // 2. Create state machine for adding ship using menu (editTileMenu)
  // 3. Create event handler for ESC button pressing
  // 4. Create ships template and added ships counter
  // 5. Add ability to use Menu to select ship from template
  // 6. For Battlefield (Add way to detect dead ship and opening of all tables around killed ship)
  // 7. Add abilitiy for chanding ship direction 

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

  const toggleDisplayHoverShip = () => {
    setDisplayHoverShip(!displayHoverShip)
  }

  // Display table API
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

    const newDisplayTableValue = displayHoveredShip(openAllTable(table), hoveredSipCoordinates);

    setDisplayTable(newDisplayTableValue);
  }

  // Callbacks
  const mouseMoveTileCallback = (e) => {
    if (!displayHoverShip) {
      const positionX = e.pageX + MENU_ELEMENT_MOUSE_DISTANCE;
      const positionY = e.pageY + MENU_ELEMENT_MOUSE_DISTANCE;
      moveTileMenuElement(positionX, positionY);
    }
  }

  const mouseEnterTileCallback = (_e, x, y) => {
    setHoveredTileCoordinates({ x, y });

    if (!displayHoveredShip) {
      openTileMenuElement()
    }
  }

  const mouseLeaveFieldCallback = (e) => {
    closeTileMenuElement();
    setDisplayHoverShip(false);
  }

  const pushTileCallback = (x, y) => {
    // addShipOnTable(x, y)
    toggleDisplayHoverShip()
  }

  useEffect(() => {
    if (displayHoverShip) {
      const { x, y } = hoveredTileCoordinates;
      closeTileMenuElement();
      setHoveredShipCoordinates(x, y);
    } else {
      setDisplayTable(openAllTable(table));
      openTileMenuElement();
    }
  }, [displayHoverShip, hoveredTileCoordinates]);

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
          mouseLeaveFieldCallback={mouseLeaveFieldCallback}
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
            <Spinner />
          </article>
        </MenuElement>
      }

    </div>
  );
}

export default EditPage;
