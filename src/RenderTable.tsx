function RenderTable({ data }: { data: number[][] }): React.JSX.Element {
  return (
    <>
      {data.map((row, key) => (
        <tr key={key}>
          {row.map((value, index) => (
            <td key={index}>
              <code>{value}</code>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default RenderTable;
