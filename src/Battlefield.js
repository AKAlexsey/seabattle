import './Battlefield.css';
import Field from './field';

import { useGlobalContext } from './context'

import { Link } from "react-router-dom";


function Battlefield() {
  const { state, shootTableCell } = useGlobalContext()

  return (
    <div className="App">

      <header>
        Battleship-game
      </header>

      <div className="bobard">
        <Field state={state} pushTileCallback={shootTableCell}/>
      </div>

      <div className='manipulate_section'>
        <Link className='btn remove-btn' to={`/`}>Edit page</Link>
      </div>
    </div>
  );
}

export default Battlefield;
