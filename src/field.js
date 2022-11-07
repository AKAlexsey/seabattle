import React from 'react'

import { useGlobalContext } from './context'

const Field = (params) => {
    const { state, openCell } = params;
    const { table } = state;
    const getCellClass = ({ opened, contains }) => {
        if (opened === false) {
            return 'closed';
        }
        return contains;
    }

    return (<div>
        <table className='game-field'>
            <tbody>
                {
                    table.map((row, y) => {
                        return (<tr key={y}>
                            {row.map((cell, x) => {
                                return (
                                  <td key={x} className={getCellClass(cell)} onClick={() => openCell(x, y)}></td>
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
