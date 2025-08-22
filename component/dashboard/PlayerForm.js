/**
 * This component renders an editable table of players similar to Spordle UI,
 * focused on inline editing of first name, last name and jersey number.
 * Designed with UX and responsiveness in mind.
 */

import { useState, useRef, useEffect } from "react";
import PlayerRow from "./PlayerRow";

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

  const handleResetPlayer = async (idx, row) => {
    // If the player has an _id, delete from DB
    if (row._id) {
      await fetch(`/api/players?id=${row._id}`, { method: "DELETE" });
    }
    // Empty the fields of the current row (but keep the row)
    setRows((prev) =>
      prev.map((r, i) =>
        i === idx ? { firstName: "", lastName: "", number: "" } : r
      )
    );
  };

  const handleToggleSuspended = async (rowIdx, newValue) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIdx ? { ...row, suspended: newValue } : row
      )
    );

    // If the player has an _id, update in DB
    const player = rows[rowIdx];
    if (player && player._id) {
      await fetch(`/api/players?id=${player._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: newValue }),
      });
    }
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
              <col className="min-w-[80px]" />
              <col className="min-w-[120px]" />
            </colgroup>
            <thead>
              <tr className="sticky top-0 bg-gray-100 font-bold text-gray-700 z-10">
                {columns.map((col) => (
                  <th key={col.key} className="py-3 px-4 text-left">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-center">Suspendu</th>
                <th className="py-3 px-4 text-center"></th> {/* Actions column */}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <PlayerRow
                  key={rowIdx}
                  row={row}
                  rowIdx={rowIdx}
                  columns={columns}
                  editing={editing}
                  setEditing={setEditing}
                  handleInputChange={handleInputChange}
                  handleInputBlur={handleInputBlur}
                  handleInputKeyDown={handleInputKeyDown}
                  handleRemovePlayer={handleRemovePlayer}
                  handleResetPlayer={handleResetPlayer}
                  inputRef={inputRef}
                  minRows={10}
                  totalRows={rows.length}
                  handleToggleSuspended={handleToggleSuspended}
                />
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
            Ajouter ligne
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
