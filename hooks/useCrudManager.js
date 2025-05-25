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
    let cleanData = { ...form };

    // Logique spécifique pour les équipes
    if (apiUrl.includes("teams")) {
      cleanData = {
        ...form,
        points: form.points === "" ? 0 : Number(form.points),
        logo:
          form.logo && form.logo.trim() !== ""
            ? form.logo
            : "https://placehold.co/60x60",
      };
    }

    // Logique spécifique pour les joueurs
    if (apiUrl.includes("players")) {
      cleanData = {
        ...form,
        goals: form.goals === "" ? 0 : Number(form.goals),
        photo:
          form.photo && form.photo.trim() !== ""
            ? form.photo
            : "https://placehold.co/60x60",
      };
    }

    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanData),
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
    const rawData = customForm || form;
    let cleanData = { ...rawData };

    if (apiUrl.includes("teams")) {
      cleanData = {
        ...rawData,
        points: rawData.points === "" ? 0 : Number(rawData.points),
        logo:
          rawData.logo && rawData.logo.trim() !== ""
            ? rawData.logo
            : "https://placehold.co/60x60",
      };
    }

    if (apiUrl.includes("players")) {
      cleanData = {
        ...rawData,
        goals: rawData.goals === "" ? 0 : Number(rawData.goals),
        photo:
          rawData.photo && rawData.photo.trim() !== ""
            ? rawData.photo
            : "https://placehold.co/60x60",
      };
    }

    await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cleanData, _id: id }),
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

  const data = {
    ...form,
    goals: form.goals === "" ? 0 : Number(form.goals),
    photo:
      form.photo && form.photo.trim() !== ""
        ? form.photo
        : "https://placehold.co/60x60",
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
