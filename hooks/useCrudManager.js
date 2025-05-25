import { useEffect, useState } from "react";

export default function useCrudManager(apiUrl, initialForm) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems);
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems);
    setForm(initialForm);
    setShowAdd(false);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm(item);
  };

  const handleSave = async (e, customId, customForm) => {
    if (e && e.preventDefault) e.preventDefault();
    const id = customId || editId;
    const data = customForm || form;
    await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, _id: id }),
    });
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems);
    setEditId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id) => {
    await fetch(`${apiUrl}?id=${id}`, { method: "DELETE" });
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems);
  };

  return {
    items,
    form,
    setForm,
    showAdd,
    setShowAdd,
    editId,
    setEditId,
    handleChange,
    handleAdd,
    handleEdit,
    handleSave,
    handleDelete,
  };
}