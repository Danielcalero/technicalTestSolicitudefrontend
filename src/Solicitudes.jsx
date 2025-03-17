import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import SolicitudForm from "./SolicitudForm";
import { CSVLink } from "react-csv";

export default function Solicitudes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [newSolicitud, setNewSolicitud] = useState({
    brand: "",
    type: "",
    sendDate: "",
    contactNumber: "",
    contactName: "",
    contacts: []
  });

  const columns = [
    {
        name: "Código",
        selector: row => row.code,
        sortable: true,
        cell: row => (
          <button
            style={{
              background: "none",
              border: "none",
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer"
            }}
            onClick={() => handleRowClick(row.id)} 
          >
            {row.code}
          </button>
        ),
      },,
    { name: "Marca", selector: row => row.brand, sortable: true },
    { name: "Tipo de solicitud", selector: row => row.type, sortable: true },
    { 
      name: "Fecha de envío", 
      selector: row => format(new Date(row.sendDate), "dd '/' MM '/' yyyy", { locale: es }), 
      sortable: true 
    },
    { name: "Número de contacto", selector: row => row.contactNumber },
    { name: "Nombre de contacto", selector: row => row.contactName }
  ];

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/solicitude/showById/${id}`);
      
      setNewSolicitud({
        id:response.data.id,
        code:response.data.code,
        brand: response.data.brand,
        type: response.data.type,
        sendDate: response.data.sendDate.split(" ")[0],
        contactNumber: response.data.contactNumber,
        contactName: response.data.contactName,
        contacts: response.data.contacts
      });
  
      setShowForm(true);
      setShowTable(false);
    } catch (error) {
      console.error("Error al obtener la solicitud:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/solicitude/showAll");
      setData(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSolicitud = async () => {
    try {
      const formattedSolicitud = {
        ...newSolicitud,
        sendDate: `${newSolicitud.sendDate} 00:00:00`,
      };

      const response = await axios.post(
        "http://localhost:8080/solicitude/saveSolicitud",
        formattedSolicitud,
        { headers: { "Content-Type": "application/json" } }
      );
      if (formattedSolicitud.id === undefined) {
        setData([...data, response.data]);
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === formattedSolicitud.id ? response.data : item
          )
        );
      }

      setShowForm(false);
      setShowTable(true);
      setNewSolicitud({ brand: "", type: "", sendDate: "", contactNumber: "", contactName: "" });
    } catch (error) {
      console.error("Error al guardar la solicitud:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {showTable && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 10px" }}>
          <h2>Solicitudes</h2>
          <div style={{display:"flex",height:"50px"}}>
            <button 
              onClick={() => { setShowForm(true); setShowTable(false); setNewSolicitud({
                brand: "",
                type: "",
                sendDate: "",
                contactNumber: "",
                contactName: "",
                contacts: []
              })}} 
              style={{ marginRight: "10px", padding: "10px 15px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Agregar Solicitud
            </button>

            <CSVLink
              data={data} 
              filename={"solicitudes.csv"}
              className="btn btn-primary"
              style={{ padding: "15px 15px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" , fontSize:"13px"}}
            >
              Exportar CSV
            </CSVLink>
          </div>
        </div>
      )}

      {showTable && <DataTable columns={columns} data={data} progressPending={loading} pagination />}

      {showForm && (
        <SolicitudForm 
          newSolicitud={newSolicitud}
          setNewSolicitud={setNewSolicitud}
          handleAddSolicitud={handleAddSolicitud}
          setShowForm={setShowForm}
          setShowTable={setShowTable}
        />
      )}
    </div>
  );
}
