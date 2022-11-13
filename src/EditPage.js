import './Battlefield.css';
import Field from './Field';
import MenuElement from './MenuElement';
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

function EditPage() {
  const { state, generateField, addShipOnTable, 
    closeTileMenuElement, moveTileMenuElement, hoverShipOnTable } = useGlobalContext()

  const mouseMoveTileCallback = (e) => {
    const positionX = e.pageX + MENU_ELEMENT_MOUSE_DISTANCE;
    const positionY = e.pageY + MENU_ELEMENT_MOUSE_DISTANCE;
    moveTileMenuElement(positionX, positionY);
  }

  const mouseLeaveFieldCallback = (e) => {
    closeTileMenuElement();
  }

  return (
    <div className="App">

      <header>
        EditPage
      </header>

      <div className="bobard">
        <Field
          state={state}
          pushTileCallback={addShipOnTable}
          mouseEnterTileCallback={() => {}}
          mouseMoveTileCallback={mouseMoveTileCallback}
          mouseLeaveFieldCallback={mouseLeaveFieldCallback}
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
