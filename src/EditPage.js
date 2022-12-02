import './Battlefield.css';
import Field from './field';

import React from 'react';

import MenuElement from './MenuElement';
import { state, generateField, addShipOnTable, noHoverShipCollision } from './context'
import { Link } from "react-router-dom";

import { displayHoveredShip, displayHoveredShipCollision, 
         hoverShipCoordinates, openAllTable, makeShip, tableIsEmpty } from "./fieldManipulationContext"

import { makeDefaultMenuState, closeTileMenu, 
          interactWithTileMenu, changeTileMenuPosition, openTileMenu, 
          hoverShipHideTileMenu, nextMenuState, previousMenuState, 
          setHoveredShip, CLOSED, OPENED, HOVER_SHIP, 
          nullifyHoverTileCoordinates, setHoverTileCoordinates,
          changeHoverShipDirection } from "./editTileMenu"

const MENU_ELEMENT_MOUSE_DISTANCE = 3;

// TODO
// 3. ! Add ab lity to change direction of the ship using space key
// 4. Add drag and drop
// 1. Fix bug with display collision // later
// 2. Add ability to draw collision in space around

class EditPage extends React.Component {
  constructor(props) {
    super(props);

    const { table } = state;

    // const { state, generateField, addShipOnTable, noHoverShipCollision } = useGlobalContext()

    // const { table, shipTemplates } = state;
  
    const displayMenuState = makeDefaultMenuState();

    this.state = {
      // ...state,
      // generateField,
      // addShipOnTable,
      // noHoverShipCollision,
      // table,
      // shipTemplates,
      displayTable: openAllTable(table),
      ...displayMenuState
    }
  }
  

  // Menu state API
  moveTileMenuElement(tileX, tileY) {
    this.setState(changeTileMenuPosition(this.state, tileX, tileY));
  }

  openTileMenuElement() {
    this.setState(openTileMenu(this.state));
  }

  interactWithTileMenuElement() {
    this.setState(interactWithTileMenu(this.state));
  }

  // Display of collision should not be here. 
  // Seems that it cause problem with unable to display collision several times on one tile
  displayHoveredShipOnTable(ship, collision) {
    const hoveredShipCoordinates = hoverShipCoordinates(ship);

    const openedTable = openAllTable(this.state.table);

    if (collision) {
      this.setState({ ...this.state, ...displayHoveredShipCollision(openedTable, hoveredShipCoordinates) });
    } else {
      this.setState({ ...this.state, ...displayHoveredShip(openedTable, hoveredShipCoordinates) });
    }
  }

  // Callbacks
  mouseMoveTileCallback(e) {
    if (this.state.menuState === OPENED || this.state.menuState === CLOSED) {
      const positionX = e.pageX + MENU_ELEMENT_MOUSE_DISTANCE;
      const positionY = e.pageY + MENU_ELEMENT_MOUSE_DISTANCE;
      this.moveTileMenuElement(positionX, positionY);
    }
  }

  mouseEnterTileCallback(_e, x, y) {
    this.setState(setHoverTileCoordinates(this.state, x, y));
  }

  pushTileCallback(_e) {
    if (this.state.menuState === HOVER_SHIP) {
      const { order, size, direction, x, y } = this.state;
      const newShip = makeShip(order, size, direction, x, y);

      if (this.noHoverShipCollision(newShip)) {
        this.addShipOnTable(newShip);
        this.setState(nextMenuState(this.state));
      } else {
       this.displayHoveredShipOnTable(newShip, true);
      }
    } else {
      this.setState(nextMenuState(this.state));
    }
  }

  mouseLeaveFieldCallback(e) {
    this.setState(closeTileMenu(nullifyHoverTileCoordinates(this.state)));
  }

  selectedMenuElementCallback(order, size) {
    const udpatedState = setHoveredShip(this.state, order, size);
    this.setState(hoverShipHideTileMenu(udpatedState));
  }

  pushButtonCallback(event) {
    if (event.code  === "Escape") {
      this.setState(previousMenuState(this.state));
    } else if (
      event.key === " " ||
      event.code === "Space" ||      
      event.keyCode === 32      
    ) {
      this.setState(changeHoverShipDirection(this.state));
    }
  };

  componentDidMount(){
    document.addEventListener("keydown", this.pushButtonCallback, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.pushButtonCallback, false);
  }

  componentDidUpdate() {
    // table must not be in this callback variables
    // To avoid infinity loop
    const { table, menuState } = this.state;
    if (tableIsEmpty(table)) {
      this.setState({ ...this.state, table: openAllTable(table) });
    }

    if (menuState === HOVER_SHIP) {
      const { order, size, direction, x, y } = this.state;  
      const newShip = makeShip(order, size, direction, x, y);
      this.displayHoveredShipOnTable(newShip, false);
    } else {
      this.setState({ ...this.state, table: openAllTable(table) });
    }
  }


  render () {
    return (
      <div className="App">

        <header className='edit_header'>
          <span>
            EditPage
          </span>

          <span>
            <button className='btn remove-btn' onClick={() => { this.state.generateField() }}>Generate Field</button>
          </span>
          
        </header>



        <div className="bobard">
          <Field
            table={this.state.displayTable}
            pushTileCallback={this.pushTileCallback}
            mouseEnterTileCallback={this.mouseEnterTileCallback}
            mouseMoveTileCallback={this.mouseMoveTileCallback}
            mouseLeaveFieldCallback={this.mouseLeaveFieldCallback}
          />
        </div>

        <div className='manipulate_section'>
          <Link className='btn clear-btn' to={`battlefield`}>To the Battlefield!!</Link>
        </div>

        {
          <MenuElement displayMenuState={this.state} hoverMenuCallback={this.interactWithTileMenuElement} >
            <article>
              <ul className='menu_list'>
                {
                  this.shipTemplates.map(({ size, maxShips, shipsPlaced }) => {
                    const menuText = `Ship ${size}. ${shipsPlaced} / ${maxShips}`;
                    const allshipsPlaced = maxShips <= shipsPlaced;
                    return (
                      <li 
                        key={size}
                        className={allshipsPlaced ? 'menu_element all_ships_placed' : 'menu_element'} 
                        onMouseDown={() => { return allshipsPlaced ? () => {} : this.selectedMenuElementCallback(shipsPlaced, size) }}
                      >
                        {menuText}
                      </li>
                    );
                  })
                }
              </ul>
            </article>
          </MenuElement>
        }

      </div>
    )
  }
}

export default EditPage;
