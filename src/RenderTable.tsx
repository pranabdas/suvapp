function RenderTable({ data }: { data: number[][] }): React.JSX.Element {
  return (
    <>
      {data.map((row, idx) => (
        <tr key={idx}>
          {row.map((col, idy) => (
            <td key={idy}>
              <code>{col}</code>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default RenderTable;
