// src/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false); // ✅ Toggle state
  const [showMap, setShowMap] = useState(false);       // ✅ Map toggle
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch Alerts
  const fetchAlerts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/alerts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlerts(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch alerts");
    }
  };
  //delete 
  useEffect(() => {
    fetchAlerts();
  }, []);

  const deleteAlert = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/alerts/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchAlerts();
  };


  const sendSOS = () => {
  // ✅ TOKEN CHECK
  if (!token) {
    alert("Login expired! Please login again.");
    navigate("/");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/alerts",
          {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("SOS SUCCESS:", res.data);

        alert("SOS Sent 🚨");
        fetchAlerts();
        setShowAlerts(true);
        setShowMap(true);
      } catch (error) {
        console.log("ERROR STATUS:", error.response?.status);
        console.log("ERROR DATA:", error.response?.data);

        if (error.response?.status === 401) {
          alert("Unauthorized! Login again.");
          navigate("/");
        } else {
          alert(error.response?.data?.message || "Failed to send SOS");
        }
      }
    },
    (err) => {
      alert("Location permission denied ❌");
    }
  );
};

  // Accept Alert (Volunteer)
  const acceptAlert = async (id) => {
    await axios.put(
      `http://localhost:5000/api/alerts/accept/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchAlerts();
  };

  // Resolve Alert
  const resolveAlert = async (id) => {
    await axios.put(
      `http://localhost:5000/api/alerts/resolve/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchAlerts();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome, {user?.name}</h1>

      {/* SOS Button */}
      {user?.role === "user" && (
        <button
          onClick={sendSOS}
          style={{
            padding: "15px",
            fontSize: "18px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "10px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          🚨 SOS
        </button>
      )}

      {/* Toggle Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowAlerts(!showAlerts)}
          style={{ marginRight: "10px", padding: "10px 15px" }}
        >
          {showAlerts ? "Hide Alerts" : "Show Alerts"}
        </button>

        <button
          onClick={() => setShowMap(!showMap)}
          style={{ padding: "10px 15px" }}
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>

      {/* Alerts Section */}
      {showAlerts && (
        <>
          <h2>Emergency Alerts</h2>
          {alerts.length === 0 ? (
             <p>No alerts available</p>
          ) : (
            alerts.map((alert) => (
              <div 
              key={alert._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                borderRadius: "8px",
                wordBreak: "break-word",
              }}
              > 
                <p>
                  <strong>User:</strong> {alert.userEmail}
                </p>
                <p>
                  <strong>Status:</strong> {alert.status}
                </p>
                <p style={{ wordBreak: "break-word"}}>
                  <strong>Location:</strong> {alert.latitude},{alert.longitude}
                  {alert.longitude}
                </p>

                {/*DELETE BUTTON */}
                <button
                  onClick={() => {
                     if (window.confirm("Delete this alert?")) {
                      deleteAlert(alert._id);
                    }
                  }}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>

                {/* Volunteer/Admin Actions */}
                {(user?.role === "volunteer" ||
                  user?.role === "admin") && (
                  <>
                    {alert.status === "pending" && (
                      <button
                        onClick={() => acceptAlert(alert._id)}
                        style={{ marginRight: "10px" }}
                      >
                        Accept
                      </button>
                    )}
                    {alert.status === "accepted" && (
                      <button
                        onClick={() => resolveAlert(alert._id)}
                      >
                        Resolve
                      </button>
                    )}
                  </>
              )}
              </div>
          ))
        )}
        </>
      )}

      {/* Map Section */}
      {showMap && (
        <>
          <h2>Live Map</h2>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "400px", width: "80%", margin: "auto" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {alerts.map((alert) => (
              <Marker
                key={alert._id}
                position={[alert.latitude, alert.longitude]}
              >
                <Popup>
                  {alert.userEmail} <br />
                  Status: {alert.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
    </div>
  );
}