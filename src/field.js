import { CLOSED_TILE_CLASS, MISS_SHOT_CONTAINS } from './fieldManipulationContext'

const Field = (params) => {
    const { table, pushTileCallback, mouseEnterTileCallback, mouseMoveTileCallback, mouseLeaveFieldCallback } = params;

    const getTileClass = ({ opened, contains }) => {
        if (opened) {
            return contains;
        } else {
            return CLOSED_TILE_CLASS;
        }

    }

    return (<div>
        <table className='game-field'>
            <tbody onMouseLeave={mouseLeaveFieldCallback}>
                {
                    table.map((row, y) => {
                        return (<tr key={y}>
                            {row.map((cell, x) => {
                                const tileClass = getTileClass(cell);
                                const { contains } = cell;
                                return (
                                    <td
                                        key={x}
                                        className={tileClass}
                                        onClick={() => pushTileCallback(x, y)}
                                        onMouseEnter={(e) => mouseEnterTileCallback(e, x, y)}
                                        onMouseMove={mouseMoveTileCallback}
                                    >
                                        { 
                                            (contains === MISS_SHOT_CONTAINS) && 
                                                <div class="loadingio-spinner-ball-ubuesjfa4bb">
                                                    <div class="ldio-dpkfja323ft">
                                                        <div></div>
                                                    </div>
                                                </div>
                                            }
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
