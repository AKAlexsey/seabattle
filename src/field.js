import { CLOSED_TILE_CLASS } from './fieldManipulationContext'

const Field = (params) => {
    const { table, pushTileCallback, mouseEnterTileCallback, mouseMoveTileCallback, mouseLeaveFieldCallback } = params;

    const getTileClass = ({ opened, contains }) => {
        if (opened) {
            return contains;
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
                                        onClick={() => pushTileCallback(x, y)}
                                        onMouseEnter={(e) => mouseEnterTileCallback(e, x, y)}
                                        onMouseMove={mouseMoveTileCallback}
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
