import './Battlefield.css';
import Field from './field';

import { useGlobalContext } from './context'

import { Link } from "react-router-dom";

function EditPage() {
  const { state, openCell, resetState } = useGlobalContext()

  return (
    <div className="App">

      <header>
        EditPage
      </header>

      <div className="bobard">
        <Field state={state} openCell={openCell}/>
      </div>

      <div className='manipulate_section'>
        <button className='btn remove-btn' onClick={resetState}>Reset field</button>
      </div>

      <div className='manipulate_section'>
        <Link className='btn clear-btn'to={`battlefield`}>To the Battlefield!!</Link>
      </div>
    </div>
  );
}

export default EditPage;
