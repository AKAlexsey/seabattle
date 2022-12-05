import {CLOSED_TILE_CLASS} from './fieldManipulationContext'

import {setEmptyFunctionIfUndefined} from './context'

const Field = (params) => {
    const {
        table, clickTileCallback, mouseDownTileCallback,
        mouseUpTileCallback, mouseEnterTileCallback,
        mouseMoveTileCallback, mouseLeaveFieldCallback
    } = params;

    const tileClickFunction = setEmptyFunctionIfUndefined(clickTileCallback);
    const tileMouseDownFunction = setEmptyFunctionIfUndefined(mouseDownTileCallback);
    const tileMouseUpFunction = setEmptyFunctionIfUndefined(mouseUpTileCallback);
    const tileMouseEnterFunction = setEmptyFunctionIfUndefined(mouseEnterTileCallback);
    const tileMouseMoveFunction = setEmptyFunctionIfUndefined(mouseMoveTileCallback);

    const getTileClass = ({opened, contains, collision}) => {
        if (opened) {
            const collisionClass = collision ? 'show_collision' : '';

            return `${contains} ${collisionClass} table_cell`;
        } else {
            return CLOSED_TILE_CLASS;
        }

    }

    return (<div className='game-field-container'>
        <table className='game-field'>
            <tbody onMouseLeave={mouseLeaveFieldCallback}>
            {
                table.map((row, y) => {
                    return (<tr key={y}>
                        {row.map((cell, x) => {
                            const tileClass = getTileClass(cell);
                            return (
                                <td
                                    key={x}
                                    className={tileClass}
                                    onClick={(e) => tileClickFunction(e, x, y)}
                                    onMouseMove={(e) => tileMouseMoveFunction(e, x, y)}
                                    onMouseEnter={(e) => tileMouseEnterFunction(e, x, y)}
                                    onMouseDown={(e) => tileMouseDownFunction(e, x, y)}
                                    onMouseUp={(e) => tileMouseUpFunction(e, x, y)}
                                >
                                </td>
                            )
                        })}
                    </tr>);
                })
            }
            </tbody>
        </table>
    </div>);
}

export default Field
