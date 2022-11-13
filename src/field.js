const Field = (params) => {
    const { state, pushTileCallback, mouseEnterTileCallback, mouseMoveTileCallback, mouseLeaveFieldCallback } = params;
    const { table } = state;

    return (<div>
        <table className='game-field'>
            <tbody onMouseLeave={mouseLeaveFieldCallback}>
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
                                        onMouseEnter={mouseEnterTileCallback}
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
