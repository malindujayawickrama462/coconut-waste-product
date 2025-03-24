import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./update.css";
import Header from "./Header";

const UpdateInventory = () => {
  // Get the 'id' parameter from the URL using useParams
  const { id } = useParams();
  // useNavigate hook to redirect after form submission
  const navigate = useNavigate();

  // State to store inventory data
  const [inventory, setInventory] = useState({
    batchId: "",
    totalWeight: "",
    collectionDate: "",
    sourceLocation: "",
    wasteType: "",
    qualityGrade: "",
    processingStatus: "",
    processingMethod: "",
    notes: "",
  });

  // State to store validation error messages
  const [errors, setErrors] = useState({});

  // Predefined list of waste types
  const wasteTypes = ["Coconut Husk", "Coconut Shell", "Coconut Fiber", "Coconut Water", "Other"];

  // Fetch inventory details on component mount
  useEffect(() => {
    axios
      .get(`http://localhost:8070/inventory/get/${id}`)
      .then((response) => {
        // Set the inventory data after fetching it
        setInventory(response.data.inventory);
      })
      .catch(() => alert("Error fetching inventory details"));
  }, [id]); // Dependency array ensures the effect runs only once when 'id' changes

  // Handle form input changes
  const handleChange = (e) => {
    setInventory({ ...inventory, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validateForm = () => {
    let newErrors = {};

    // Validate total weight
    if (!inventory.totalWeight || isNaN(inventory.totalWeight) || inventory.totalWeight <= 0) {
      newErrors.totalWeight = "Total weight must be a positive number.";
    }

    // Validate collection date
    if (!inventory.collectionDate) {
      newErrors.collectionDate = "Collection date is required.";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (inventory.collectionDate > today) {
        newErrors.collectionDate = "Collection date cannot be in the future.";
      }
    }

    // Validate waste type
    if (!inventory.wasteType) {
      newErrors.wasteType = "Waste type is required.";
    } else if (!wasteTypes.includes(inventory.wasteType)) {
      newErrors.wasteType = "Invalid waste type selected.";
    }

    // Validate quality grade
    if (!inventory.qualityGrade) {
      newErrors.qualityGrade = "Please select a quality grade.";
    }

    // Validate processing status
    if (!inventory.processingStatus) {
      newErrors.processingStatus = "Please select a processing status.";
    }

    // Set the validation errors
    setErrors(newErrors);

    // Return true if no errors, otherwise false
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // If form is not valid, do not submit
    if (!validateForm()) return;

    // Make PUT request to update inventory
    axios
      .put(`http://localhost:8070/inventory/update/${id}`, inventory)
      .then(() => {
        alert("Inventory updated successfully");
        navigate("/inventory"); // Navigate back to inventory list page
      })
      .catch(() => alert("Error updating inventory"));
  };

  return (
    <div>
      <Header />
      <div className="update-form-container">
        <div className="update-form-card">
          <h2>Update Inventory</h2>
          <form onSubmit={handleSubmit}>
            {/* Batch ID (Read-only field) */}
            <div className="form-group">
              <label>Batch ID:</label>
              <input type="text" name="batchId" value={inventory.batchId} readOnly className="form-input read-only" />
            </div>

            {/* Total Weight (kg) */}
            <div className="form-group">
              <label>Total Weight (kg):</label>
              <input type="number" name="totalWeight" value={inventory.totalWeight} onChange={handleChange} className="form-input" />
              {errors.totalWeight && <p className="error">{errors.totalWeight}</p>} {/* Show error if any */}
            </div>

            {/* Collection Date */}
            <div className="form-group">
              <label>Collection Date:</label>
              <input type="date" name="collectionDate" value={inventory.collectionDate} onChange={handleChange} className="form-input" />
              {errors.collectionDate && <p className="error">{errors.collectionDate}</p>} {/* Show error if any */}
            </div>

            {/* Source Location (Read-only field) */}
            <div className="form-group">
              <label>Source Location:</label>
              <input type="text" name="sourceLocation" value={inventory.sourceLocation} readOnly className="form-input read-only" />
            </div>

            {/* Waste Type */}
            <div className="form-group">
              <label>Waste Type:</label>
              <select name="wasteType" value={inventory.wasteType} onChange={handleChange} className="form-input">
                <option value="">Select Waste Type</option>
                {wasteTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.wasteType && <p className="error">{errors.wasteType}</p>} {/* Show error if any */}
            </div>

            {/* Quality Grade */}
            <div className="form-group">
              <label>Quality Grade:</label>
              <select name="qualityGrade" value={inventory.qualityGrade} onChange={handleChange} className="form-input">
                <option value="">Select Quality Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              {errors.qualityGrade && <p className="error">{errors.qualityGrade}</p>} {/* Show error if any */}
            </div>

            {/* Processing Status */}
            <div className="form-group">
              <label>Processing Status:</label>
              <select name="processingStatus" value={inventory.processingStatus} onChange={handleChange} className="form-input">
                <option value="">Select Processing Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.processingStatus && <p className="error">{errors.processingStatus}</p>} {/* Show error if any */}
            </div>

            {/* Processing Method */}
            <div className="form-group">
              <label>Processing Method:</label>
              <input type="text" name="processingMethod" value={inventory.processingMethod} onChange={handleChange} className="form-input" />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>Notes:</label>
              <textarea name="notes" value={inventory.notes} onChange={handleChange} className="form-input"></textarea>
            </div>

            {/* Submit and Cancel buttons */}
            <div className="button-group">
              <button type="submit" className="submit-btn">
                Update
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/inventory")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateInventory;
