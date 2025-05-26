import cleanData from "@/utils/cleanData";
import { useEffect, useState } from "react";

// Ce hook personnalisé permet de gérer facilement le CRUD (Create, Read, Update, Delete)
// pour n'importe quelle ressource (équipes, joueurs, etc.) en passant l'URL de l'API et un formulaire initial.
export default function useCrudManager(apiUrl, initialForm) {
  // items : la liste des objets récupérés depuis l'API (équipes, joueurs, etc.)
  const [items, setItems] = useState([]);
  // form : l'état du formulaire (pour ajouter ou éditer un objet)
  const [form, setForm] = useState(initialForm);
  // showAdd : booléen pour afficher ou cacher le formulaire d'ajout
  const [showAdd, setShowAdd] = useState(false);
  // editId : identifiant de l'objet en cours d'édition (null si aucun)
  const [editId, setEditId] = useState(null);

  // useEffect : au chargement du composant (ou si l'URL change), on récupère la liste des objets depuis l'API
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems); // on met à jour la liste avec les données reçues
  }, [apiUrl]);

  // handleChange : met à jour le formulaire quand l'utilisateur tape dans un champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // handleAdd : ajoute un nouvel objet (équipe, joueur, etc.)
  const handleAdd = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page
    const clean = cleanData(form); // prépare les données

    // Envoie une requête POST à l'API pour ajouter l'objet
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clean),
    });
    // Après l'ajout, on recharge la liste
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems);
    setForm(initialForm); // on réinitialise le formulaire
    setShowAdd(false);    // on ferme le formulaire d'ajout
  };

  // handleEdit : prépare le formulaire pour éditer un objet existant
  const handleEdit = (item) => {
    setEditId(item._id); // on retient l'id de l'objet à éditer
    setForm(item);       // on remplit le formulaire avec ses données
  };

  // handleSave : sauvegarde les modifications d'un objet existant
  const handleSave = async (e, customId, customForm) => {
    if (e && e.preventDefault) e.preventDefault();
    const id = customId || editId;           // id de l'objet à modifier
    const rawData = customForm || form;      // données à sauvegarder
    const clean = cleanData(rawData, apiUrl);        // on prépare les données

    // Envoie une requête PUT à l'API pour modifier l'objet
    await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...clean, _id: id }),
    });
    // Après la modification, on recharge la liste
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems);
    setEditId(null);        // on sort du mode édition
    setForm(initialForm);   // on réinitialise le formulaire
  };

  // handleDelete : supprime un objet
  const handleDelete = async (id) => {
    await fetch(`${apiUrl}?id=${id}`, { method: "DELETE" });
    // Après la suppression, on recharge la liste
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setItems);
  };

  // On retourne toutes les variables et fonctions utiles pour le composant qui utilise ce hook
  return {
    items,         // la liste des objets (équipes, joueurs, etc.)
    form,          // le formulaire courant
    setForm,       // pour modifier le formulaire
    showAdd,       // booléen pour afficher/cacher le formulaire d'ajout
    setShowAdd,    // pour modifier showAdd
    editId,        // id de l'objet en cours d'édition
    setEditId,     // pour modifier editId
    handleChange,  // pour gérer les changements dans le formulaire
    handleAdd,     // pour ajouter un objet
    handleEdit,    // pour préparer l'édition d'un objet
    handleSave,    // pour sauvegarder un objet édité
    handleDelete,  // pour supprimer un objet
  };
}
