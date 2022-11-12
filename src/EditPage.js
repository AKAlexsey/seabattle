import './Battlefield.css';
import Field from './Field';
import MenuElement from './MenuElement';
import { useEffect  } from 'react'
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";

 
const localStorageName = 'seaBattle';


function EditPage() {
  const { state, generateField, addShipOnTable, setMenuElementOpened, setMenuElementPosition } = useGlobalContext()

  const hoverTileCallback = (e) => {
    e.stopPropagation();

    const tileBoundaries = e.target.getBoundingClientRect()
    // {x: 1056.5, y: 210.5, width: 50, height: 50, top: 210.5, …}
    // {
    //   bottom
    //   : 
    //   260.5
    //   height
    //   : 
    //   50
    //   left
    //   : 
    //   1056.5
    //   right
    //   : 
    //   1106.5
    //   top
    //   : 
    //   210.5
    //   width
    //   : 
    //   50
    //   x
    //   : 
    //   1056.5
    //   y
    //   : 
    //   210.5
    // }
    const positionX = tileBoundaries.left + tileBoundaries.width + 50;
    const positionY = tileBoundaries.top + tileBoundaries.height + 50;
    console.log({ positionX, positionY });
    setMenuElementOpened(true);
    setMenuElementPosition(positionX, positionY)
  }

  const unhoverTileCallback = (e) => {
    e.stopPropagation();
    // console.log(e)
    // setMenuElementOpened(false);
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
