import './App.css';
import Field from './field';

import { useGlobalContext } from './context'

function App() {
  const { resetState } = useGlobalContext();
  return (
    <div className="App">

      <header>
        Battleship-game
      </header>

      <div className="bobard">
        <Field />
      </div>

      <div>
        <button className='btn remove-btn' onClick={resetState}>Reset field</button>
      </div>
    </div>
  );
}

export default App;
