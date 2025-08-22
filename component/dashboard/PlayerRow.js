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
  handleResetPlayer,
  inputRef,
  minRows,
  totalRows,
  handleToggleSuspended, // <-- Add this prop
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
            className="py-2 px-4 cursor-pointer rounded transition align-middle"
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
                className="input input-xs input-bordered w-full bg-transparent focus:bg-transparent shadow-none border border-gray-300 py-1 px-2 min-h-6 align-middle"
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
              <span className="block w-full align-middle">{row[col.key]}</span>
            )}
          </td>
        );
      })}
      {/* Suspended switch column, aligned center and middle */}
      <td className="flex gap-3 justify-end py-2 px-4 align-middle">
        <input
          type="checkbox"
          value="synthwave"
          className="toggle theme-controller"
          checked={!!row.suspended}
          onClick={(e) => e.stopPropagation()} // <-- Prevent cell edit mode
          onChange={() => handleToggleSuspended(rowIdx, !row.suspended)}
          style={{ verticalAlign: "middle" }}
        />
        <button
          className="btn btn-warning btn-xs"
          type="button"
          onClick={() => handleResetPlayer(rowIdx, row)}
          title="Réinitialiser ce joueur"
        >
          &#8635;
        </button>
        <button
          className="btn btn-error btn-xs px-2.5"
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
