import React, { useState } from "react";

export default function SolicitudForm({ newSolicitud, setNewSolicitud, handleAddSolicitud, setShowForm, setShowTable }) {
  const [contact, setContact] = useState({ contactNumber: "", contactName: "" });

  const handleAddContact = () => {
    if (contact.contactNumber && contact.contactName) {
      setNewSolicitud({ 
        ...newSolicitud, 
        contacts: [...(newSolicitud.contacts || []), contact] 
      });
      setContact({ contactName: "", contactNumber: "" }); 
    }
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = [...(newSolicitud.contacts || [])];
    updatedContacts.splice(index, 1);
    setNewSolicitud({ ...newSolicitud, contacts: updatedContacts });
  };

  return (
    <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px", width: "600px" }}>
      <h3>{newSolicitud.id ? "Editar Solicitud" : "Agregar Nueva Solicitud"}</h3>
      
      <input style={{ width: "100%", marginBottom: "10px" }}
        type="text" placeholder="Marca" value={newSolicitud.brand || ""} 
        onChange={(e) => setNewSolicitud({ ...newSolicitud, brand: e.target.value })} 
      />

      <input style={{ width: "100%", marginBottom: "10px" }}
        type="text" placeholder="Tipo" value={newSolicitud.type || ""} 
        onChange={(e) => setNewSolicitud({ ...newSolicitud, type: e.target.value })} 
      />

      <input style={{ width: "100%", marginBottom: "10px" }}
        type="date" value={newSolicitud.sendDate || ""} 
        onChange={(e) => setNewSolicitud({ ...newSolicitud, sendDate: e.target.value })} 
      />

      <input style={{ width: "100%", marginBottom: "10px" }}
        type="number" placeholder="Número de contacto" value={newSolicitud.contactNumber || ""} 
        onChange={(e) => setNewSolicitud({ ...newSolicitud, contactNumber: e.target.value })} 
      />

      <input style={{ width: "100%", marginBottom: "10px" }}
        type="text" placeholder="Nombre de contacto" value={newSolicitud.contactName || ""} 
        onChange={(e) => setNewSolicitud({ ...newSolicitud, contactName: e.target.value })} 
      />

      <h4>Agregar Contacto</h4>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Número de contacto"
          value={contact.contactNumber}
          onChange={(e) => setContact({ ...contact, contactNumber: e.target.value })}
          style={{ flex: 1 }}
        />
        <input
          type="text"
          placeholder="Nombre de contacto"
          value={contact.contactName}
          onChange={(e) => setContact({ ...contact, contactName: e.target.value })}
          style={{ flex: 1 }}
        />
        <button onClick={handleAddContact} style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          +
        </button>
      </div>

      {newSolicitud.contacts && newSolicitud.contacts.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "2px" ,fontSize:"15px"}}>Número</th>
              <th style={{ border: "1px solid #ddd", padding: "2px" ,fontSize:"15px"}}>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {newSolicitud.contacts.map((c, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "2px" ,fontSize:"15px"}}>{c.contactNumber}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px" ,fontSize:"15px"}}>{c.contactName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button 
        onClick={handleAddSolicitud} 
        style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        {newSolicitud.id ? "Actualizar" : "Guardar"}
      </button>

      <button 
        onClick={() => { setShowForm(false); setShowTable(true); }} 
        style={{ marginLeft: "10px", padding: "10px 15px", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Cancelar
      </button>
    </div>
  );
}
