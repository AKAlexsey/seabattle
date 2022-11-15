import './Battlefield.css';
import Field from './Field';
import { useState } from 'react';
import MenuElement from './MenuElement';
import { useGlobalContext, doNothingFunction } from './context'
import { Link } from "react-router-dom";

import { DIRECTION_DOWN, displayHoveredShip, hoverShipCoordinates, openAllTable }  from "./fieldManipulationContext"

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

function EditPage() {
  const { state, generateField, addShipOnTable, 
    closeTileMenuElement, moveTileMenuElement } = useGlobalContext()

    const { table } = state;

    // Here probably will be more suitable list of functions, that will apply as filtration
    // It will allow to use chain of functions
    // But in this case to avoid ovecomplication - 
    const [displayTable, setDisplayTable] = useState(openAllTable(table));
    const [displayHoverShip, setDisplayHoverShip] = useState(false);

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

  const mouseEnterTileCallback = (_e, x, y) => {
    setHoveredShipCoordinates(x, y)
  }

  const mouseLeaveFieldCallback = (e) => {
    setDisplayTable(openAllTable(table));
  }

  return (
    <div className="App">

      <header>
        EditPage
      </header>

      <div className="bobard">
        <Field
          table={displayTable}
          pushTileCallback={addShipOnTable}
          mouseEnterTileCallback={mouseEnterTileCallback}
          mouseMoveTileCallback={doNothingFunction} // mouseMoveTileCallback}
          mouseLeaveFieldCallback={mouseLeaveFieldCallback} // mouseLeaveFieldCallback}
        />
      </div>

      <div className='manipulate_section'>
        <button className='btn remove-btn' onClick={() => { generateField() }}>Generate Field</button>
      </div>

      <div className='manipulate_section'>
        <Link className='btn clear-btn'to={`battlefield`}>To the Battlefield!!</Link>
      </div>

      <MenuElement >
        <article>
          <ul>
            <li>Menu element #1</li>
            <li>Menu element #2</li>
            <li>Menu element #3</li>
          </ul>
        </article>
      </MenuElement>
    </div>
  );
}

export default EditPage;
