function PlayerRow({
  row,
  rowIdx,
  columns,
  editing,
  setEditing,
  handleInputChange,
  handleInputBlur,
  handleInputKeyDown,
  handleRemovePlayer,
  inputRef,
  minRows,
  totalRows,
}) {
  return (
    <tr
      className={
        rowIdx % 2 === 0
          ? "bg-white hover:bg-gray-50"
          : "bg-gray-50 hover:bg-gray-100"
      }
      style={{ height: "2.5rem" }}
    >
      {columns.map((col) => {
        const isEditing = editing.row === rowIdx && editing.col === col.key;
        const isNumber = col.key === "number";
        return (
          <td
            key={col.key}
            className="py-2 px-4 cursor-pointer rounded transition"
            style={{ minWidth: 0, width: "1%" }}
            onClick={(e) => {
              e.stopPropagation();
              setEditing({ row: rowIdx, col: col.key });
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                type={isNumber ? "number" : "text"}
                className="input input-xs input-bordered w-full bg-transparent focus:bg-transparent shadow-none border border-gray-300 py-1 px-2 min-h-6"
                value={
                  isNumber &&
                  (row[col.key] < 0 ||
                    row[col.key] === "" ||
                    row[col.key] == null)
                    ? ""
                    : row[col.key] ?? ""
                }
                onChange={(e) =>
                  handleInputChange(
                    rowIdx,
                    col.key,
                    isNumber
                      ? e.target.value === ""
                        ? ""
                        : e.target.valueAsNumber
                      : e.target.value
                  )
                }
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
                required
              />
            ) : (
              <span className="block w-full">{row[col.key]}</span>
            )}
          </td>
        );
      })}
      <td className="py-2 px-4">
        <button
          className="btn btn-error btn-xs"
          type="button"
          onClick={() => handleRemovePlayer(rowIdx)}
          disabled={totalRows <= minRows}
          title="Supprimer ce joueur"
        >
          -
        </button>
      </td>
    </tr>
  );
}

export default PlayerRow;
