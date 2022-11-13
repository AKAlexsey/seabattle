import './Battlefield.css';
import Field from './Field';

import { useGlobalContext } from './context'

import { Link } from "react-router-dom";


function Battlefield() {
  const { state, shootTableTile } = useGlobalContext()

  const mouseEnterTileCallback = () => { console.log('Battlefield enter event') };
  const mouseLeaveTileCallback = () => { console.log('Battlefield leave field event') };

  return (
    <div className="App">

      <header>
        Battleship-game
      </header>

      <div className="bobard">
        <Field 
          state={state}
          pushTileCallback={shootTableTile}
          mouseEnterTileCallback={mouseEnterTileCallback}
          mouseLeaveTileCallback={mouseLeaveTileCallback}
        />
      </div>

      <div className='manipulate_section'>
        <Link className='btn remove-btn' to={`/`}>Edit page</Link>
      </div>
    </div>
  );
}

export default Battlefield;
