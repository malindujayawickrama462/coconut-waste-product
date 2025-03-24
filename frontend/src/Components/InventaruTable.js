import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./table.css";
import Header from "../Components/Header";

const InventoryTable = () => {
  // State variables
  const [inventoryData, setInventoryData] = useState([]); // Stores inventory data
  const [totalWeight, setTotalWeight] = useState(0); // Stores total weight of waste
  const [wasteTypeTotals, setWasteTypeTotals] = useState({}); // Stores weight categorized by waste type
  const [lowStockItems, setLowStockItems] = useState([]); // Stores items that are low in stock
  const [loading, setLoading] = useState(true); // Loading state indicator
  const [error, setError] = useState(""); // Error state for API calls
  const navigate = useNavigate(); // Navigation hook
  const STOCK_THRESHOLD = 5; // Minimum threshold for low stock alert

  // Fetch data from API on component mount
  useEffect(() => {
    axios.get("http://localhost:8070/inventory/")
      .then((response) => {
        const validData = response.data.filter(item => validateInventoryItem(item)); // Filter valid data

        setInventoryData(validData);

        // Calculate total weight of all inventory items
        const total = validData.reduce((sum, item) => sum + parseFloat(item.totalWeight || 0), 0);
        setTotalWeight(total);

        // Calculate total weight by waste type
        const typeTotals = validData.reduce((acc, item) => {
          const type = item.wasteType || "Unknown";
          acc[type] = (acc[type] || 0) + parseFloat(item.totalWeight || 0);
          return acc;
        }, {});
        setWasteTypeTotals(typeTotals);

        // Identify items that are below the stock threshold
        const lowStock = validData.filter(item => item.totalWeight < STOCK_THRESHOLD);
        setLowStockItems(lowStock);

        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching data. Please try again.");
        setLoading(false);
      });
  }, []);

  // Validate inventory items before processing
  const validateInventoryItem = (item) => {
    if (!item.batchId || typeof item.batchId !== "string" || item.batchId.trim() === "") {
      console.warn("Invalid batch ID detected", item);
      return false;
    }
    if (isNaN(item.totalWeight) || parseFloat(item.totalWeight) <= 0) {
      console.warn("Invalid total weight detected", item);
      return false;
    }
    if (!item.wasteType || typeof item.wasteType !== "string" || item.wasteType.trim() === "") {
      console.warn("Invalid waste type detected", item);
      return false;
    }
    return true;
  };

  // Navigate to update page for selected inventory item
  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  // Delete an inventory item after user confirmation
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    axios.delete(`http://localhost:8070/inventory/delete/${id}`)
      .then(() => {
        const updatedData = inventoryData.filter((item) => item._id !== id);
        setInventoryData(updatedData);

        // Recalculate total weight after deletion
        const total = updatedData.reduce((sum, item) => sum + parseFloat(item.totalWeight || 0), 0);
        setTotalWeight(total);

        // Recalculate waste type totals after deletion
        const typeTotals = updatedData.reduce((acc, item) => {
          const type = item.wasteType || "Unknown";
          acc[type] = (acc[type] || 0) + parseFloat(item.totalWeight || 0);
          return acc;
        }, {});
        setWasteTypeTotals(typeTotals);

        // Update low stock list
        const lowStock = updatedData.filter(item => item.totalWeight < STOCK_THRESHOLD);
        setLowStockItems(lowStock);

        alert("Item deleted successfully");
      })
      .catch(() => alert("Error deleting item"));
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <h2>Coconut Waste Inventory</h2>

      {/* Low Stock Alert Section */}
      {lowStockItems.length > 0 && (
        <div className="alert-box">
          <p>⚠️ Warning: The following items are low on stock (below {STOCK_THRESHOLD}kg):</p>
          <ul>
            {lowStockItems.map(item => (
              <li key={item._id}>Batch ID: {item.batchId} - {item.totalWeight}kg</li>
            ))}
          </ul>
        </div>
      )}

      {/* Total Weight Overview */}
      <div className="total-weight-container">
        <div className="total-weight-card">
          <h3>Total Waste Weight</h3>
          <p>{totalWeight} kg</p>
        </div>
      </div>

      {/* Total Weight by Waste Type */}
      <div className="waste-type-container">
        {Object.keys(wasteTypeTotals).map((type) => (
          <div key={type} className="waste-type-card">
            <h4>{type}</h4>
            <p>{wasteTypeTotals[type]} kg</p>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Total Weight (kg)</th>
            <th>Collection Date</th>
            <th>Source Location</th>
            <th>Waste Type</th>
            <th>Quality Grade</th>
            <th>Processing Status</th>
            <th>Processing Method</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item._id} className={item.totalWeight < STOCK_THRESHOLD ? "low-stock" : ""}>
              <td>{item.batchId}</td>
              <td>{item.totalWeight}</td>
              <td>{item.collectionDate ? new Date(item.collectionDate).toLocaleDateString() : "N/A"}</td>
              <td>{item.sourceLocation}</td>
              <td>{item.wasteType}</td>
              <td>{item.qualityGrade}</td>
              <td>{item.processingStatus}</td>
              <td>{item.processingMethod}</td>
              <td>{item.notes}</td>
              <td>
                <button className="update-btn" onClick={() => handleUpdate(item._id)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
