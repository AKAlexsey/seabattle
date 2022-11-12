import { hover } from '@testing-library/user-event/dist/hover';

import { useGlobalContext } from './context'

const Field = (params) => {
    const { state, pushTileCallback, hoverTileCallback, unhoverTileCallback } = params;
    const { table } = state;

    return (<div>
        <table className='game-field'>
            <tbody>
                {
                    table.map((row, y) => {
                        return (<tr key={y}>
                            {row.map((cell, x) => {
                                const { contains } = cell;
                                return (
                                    <td 
                                        key={x} 
                                        className={contains} 
                                        onClick={() => pushTileCallback(x, y)}
                                        onMouseEnter={(e) => { hoverTileCallback(e) }}
                                        onMouseLeave={(e) => { unhoverTileCallback(e) }}
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
