import './Battlefield.css';
import Field from './field';
import React, { useState, useEffect  } from 'react'
import { useGlobalContext } from './context'
import { Link } from "react-router-dom";
import { openAllTable }  from "./FieldManipulationContext"

const localStorageName = 'seaBattle';


function EditPage() {
  const { state, generateField, addShipOnTable } = useGlobalContext()

  useEffect(() => {
    localStorage.setItem(localStorageName, JSON.stringify(state))
}, [state]);

  return (
    <div className="App">

      <header>
        EditPage
      </header>

      <div className="bobard">
        <Field state={state} pushTileCallback={addShipOnTable} />
      </div>

      <div className='manipulate_section'>
        <button className='btn remove-btn' onClick={() => { generateField() }}>Generate Field</button>
      </div>

      <div className='manipulate_section'>
        <Link className='btn clear-btn'to={`battlefield`}>To the Battlefield!!</Link>
      </div>
    </div>
  );
}

export default EditPage;
