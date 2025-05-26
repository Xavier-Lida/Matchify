/**
 * This component renders an editable table of players similar to Spordle UI,
 * focused on inline editing of first name, last name and jersey number.
 * Designed with UX and responsiveness in mind.
 */

import { useState, useRef, useEffect } from "react";

export default function PlayerForm({ players = [], onSave, onClose }) {
  // Always keep at least 10 rows
  const getInitialRows = () => {
    const base = players.length > 0 ? players.map((p) => ({ ...p })) : [];
    while (base.length < 10) {
      base.push({ firstName: "", lastName: "", number: "" });
    }
    return base;
  };

  const [rows, setRows] = useState(getInitialRows());
  const [editing, setEditing] = useState({ row: null, col: null });
  const inputRef = useRef(null);

  // Ensure at least 10 rows after deletion
  useEffect(() => {
    if (rows.length < 10) {
      setRows((prev) => {
        const newRows = [...prev];
        while (newRows.length < 10) {
          newRows.push({ firstName: "", lastName: "", number: "" });
        }
        return newRows;
      });
    }
  }, [rows.length]);

  const handleCellClick = (rowIdx, col) => {
    setEditing({ row: rowIdx, col });
  };

  const handleInputChange = (rowIdx, col, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === rowIdx ? { ...row, [col]: value } : row))
    );
  };

  const handleInputBlur = () => {
    setEditing({ row: null, col: null });
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      setEditing({ row: null, col: null });
    }
  };

  const handleAddPlayer = () => {
    setRows((prev) => [...prev, { firstName: "", lastName: "", number: "" }]);
  };

  const handleRemovePlayer = (idx) => {
    // Only allow removing if more than 10 rows will remain
    setRows((prev) =>
      prev.length > 10 ? prev.filter((_, i) => i !== idx) : prev
    );
  };

  const handleSave = () => {
    if (onSave) {
      // Only send rows with at least a first or last name or number
      onSave(
        rows.filter(
          (row) =>
            row.firstName?.trim() ||
            row.lastName?.trim() ||
            row.number?.toString().trim()
        )
      );
    } else {
      // fallback: log to console
      // eslint-disable-next-line no-console
      console.log(rows);
    }
  };

  const columns = [
    { key: "firstName", label: "Prénom" },
    { key: "lastName", label: "Nom" },
    { key: "number", label: "Numéro" },
  ];

  // Set a max height and scroll if more than 10 rows
  const tableWrapperStyle =
    rows.length > 10
      ? { maxHeight: "28rem", overflowY: "auto", overflowX: "auto" }
      : { overflowX: "auto" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ overflow: "hidden" }}
    >
      {/* Prevent background scroll when modal is open */}
      <style>{`body { overflow: hidden !important; }`}</style>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        {onClose && (
          <button
            className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        )}
        <h2 className="text-xl font-bold mb-4">Éditer les joueurs</h2>
        <div className="rounded-lg shadow" style={tableWrapperStyle}>
          <table className="min-w-full table-auto border-collapse">
            <colgroup>
              <col className="min-w-[150px]" />
              <col className="min-w-[200px]" />
              <col className="min-w-[80px]" />
            </colgroup>
            <thead>
              <tr className="sticky top-0 bg-gray-100 font-bold text-gray-700 z-10">
                {columns.map((col) => (
                  <th key={col.key} className="py-3 px-4 text-left">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={
                    rowIdx % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                  style={{ height: "2.5rem" }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="py-2 px-4 cursor-pointer rounded transition"
                      style={{ minWidth: 0, width: "1%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing({ row: rowIdx, col: col.key });
                      }}
                    >
                      {editing.row === rowIdx && editing.col === col.key ? (
                        <input
                          ref={inputRef}
                          type={col.key === "number" ? "number" : "text"}
                          className="input input-xs input-bordered w-full bg-transparent focus:bg-transparent shadow-none border border-gray-300 py-1 px-2 min-h-6"
                          value={row[col.key] || ""}
                          onChange={(e) =>
                            handleInputChange(rowIdx, col.key, e.target.value)
                          }
                          onBlur={handleInputBlur}
                          onKeyDown={handleInputKeyDown}
                          autoFocus
                        />
                      ) : (
                        <span className="block w-full">{row[col.key]}</span>
                      )}
                    </td>
                  ))}
                  <td className="py-2 px-4">
                    <button
                      className="btn btn-error btn-xs"
                      type="button"
                      onClick={() => handleRemovePlayer(rowIdx)}
                      disabled={rows.length <= 10}
                      title="Supprimer ce joueur"
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-between mt-4">
          <button
            className="btn btn-sm btn-success"
            onClick={handleAddPlayer}
            type="button"
          >
            Ajouter joueur
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            type="button"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
