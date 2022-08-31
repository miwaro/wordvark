function TableRow({ row }) {
    return (
        <tr>
            {row.map(val => <td>{val}</td>)}
        </tr>
    )
}

export default TableRow;