import './Battlefield.css';
import Field from './Field';

import { useGlobalContext } from './context'

import { Link } from "react-router-dom";


function Battlefield() {
  const { state: { table }, shootTableTile } = useGlobalContext()

  return (
    <div className="App">

      <header>
        Battleship-game
      </header>

      <div className="bobard">
        <Field 
          table={table}
          clickTileCallback={shootTableTile}
        />
      </div>

      <div className='manipulate_section'>
        <Link className='btn remove-btn' to={`/`}>Edit page</Link>
      </div>
    </div>
  );
}

export default Battlefield;
