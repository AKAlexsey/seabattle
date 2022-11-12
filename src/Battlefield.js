import './Battlefield.css';
import Field from './Field';

import { useGlobalContext } from './context'

import { Link } from "react-router-dom";


function Battlefield() {
  const { state, shootTableTile } = useGlobalContext()

  const hoverTileCallback = () => { console.log('Battlefield ') };
  const unhoverTileCallback = () => { console.log('Battlefield ') };

  return (
    <div className="App">

      <header>
        Battleship-game
      </header>

      <div className="bobard">
        <Field 
          state={state}
          pushTileCallback={shootTableTile}
          hoverTileCallback={hoverTileCallback}
          unhoverTileCallback={unhoverTileCallback}
        />
      </div>

      <div className='manipulate_section'>
        <Link className='btn remove-btn' to={`/`}>Edit page</Link>
      </div>
    </div>
  );
}

export default Battlefield;
