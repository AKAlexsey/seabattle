import './Battlefield.css';
import Field from './Field';
import MenuElement from './MenuElement';
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";


function EditPage() {
  const { state, generateField, addShipOnTable, 
    openTileMenuElement, 
    closeTileMenuElement } = useGlobalContext()

  const hoverTileCallback = (e) => {
    e.stopPropagation();

    const tileBoundaries = e.target.getBoundingClientRect()
    const positionX = tileBoundaries.left + tileBoundaries.width + 3;
    const positionY = tileBoundaries.top + tileBoundaries.height / 2;
    openTileMenuElement(positionX, positionY);
  }

  const unhoverTileCallback = (e) => {
    e.stopPropagation();
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
          hoverTileCallback={hoverTileCallback}
          unhoverTileCallback={unhoverTileCallback}
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
