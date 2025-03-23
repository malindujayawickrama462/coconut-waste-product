// Import necessary modules
import './form.css'; // Import external stylesheet for styling
import React, { useState } from 'react'; // Import React and useState hook for state management
import axios from 'axios'; // Import axios for making HTTP requests

// Define the CoconutWasteForm component
const CoconutWasteForm = () => {
  // Define state to manage form data
  const [formData, setFormData] = useState({
    batchId: '', // Unique identifier for the batch
    totalWeight: '', // Total weight of the coconut waste
    collectionDate: '', // Date of waste collection
    sourceLocation: '', // Source location of the waste
    wasteType: 'Coconut Husk', // Default waste type
    qualityGrade: 'Grade A', // Default quality grade
    processingStatus: 'Pending', // Default processing status
    processingMethod: 'Mechanical', // Default processing method
    notes: '' // Additional notes
  });

  // State to handle validation errors
  const [errors, setErrors] = useState({});

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Perform  validation
    let newErrors = {};
    if (!formData.batchId.trim()) newErrors.batchId = 'Batch ID is required';
    if (!formData.totalWeight || formData.totalWeight <= 0)
      newErrors.totalWeight = 'Total Weight must be greater than 0';
    if (!formData.collectionDate) newErrors.collectionDate = 'Collection Date is required';
    if (!formData.sourceLocation.trim()) newErrors.sourceLocation = 'Source Location is required';

    // Update error state
    setErrors(newErrors);

    // Stop submission if validation errors exist
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      // Send data to backend API
      await axios.post("http://localhost:8070/inventory/add", formData);
      alert("Waste details added successfully!"); // Show success message

      // Reset form fields
      setFormData({
        batchId: '',
        totalWeight: '',
        collectionDate: '',
        sourceLocation: '',
        wasteType: 'Coconut Husk',
        qualityGrade: 'Grade A',
        processingStatus: 'Pending',
        processingMethod: 'Mechanical',
        notes: ''
      });
    } catch (err) {
      alert("Error adding details: " + err.message); // Show error message if request fails
    }
  };

  // Handle input changes and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="inventory-form">
      <h2>Coconut Waste Inventory Details</h2> {/* Form heading */}
      <form onSubmit={handleSubmit}>
        
        {/* Batch Information Section */}
        <fieldset>
          <legend>Batch Information</legend>
          <div className="form-group">
            <label>Batch ID</label>
            <input
              type="text"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
            />
            {errors.batchId && <span className="error-text">{errors.batchId}</span>}
          </div>
        </fieldset>

        {/* Quantity Details Section */}
        <fieldset>
          <legend>Quantity Details</legend>
          <div className="form-group">
            <label>Total Weight (kg)</label>
            <input
              type="number"
              name="totalWeight"
              value={formData.totalWeight}
              onChange={handleChange}
              required
            />
            {errors.totalWeight && <span className="error-text">{errors.totalWeight}</span>}
          </div>
        </fieldset>

        {/* Collection Date & Source Location Section */}
        <fieldset>
          <legend>Collection Date</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="collectionDate"
                value={formData.collectionDate}
                onChange={handleChange}
                required
              />
              {errors.collectionDate && <span className="error-text">{errors.collectionDate}</span>}
            </div>
            <div className="form-group">
              <label>Source Location</label>
              <input
                type="text"
                name="sourceLocation"
                value={formData.sourceLocation}
                onChange={handleChange}
                required
              />
              {errors.sourceLocation && <span className="error-text">{errors.sourceLocation}</span>}
            </div>
          </div>
        </fieldset>

        {/* Waste Type & Quality Grade Section */}
        <fieldset>
          <legend>Waste Type</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select name="wasteType" value={formData.wasteType} onChange={handleChange}>
                <option>Coconut Husk</option>
                <option>Coconut Shell</option>
                <option>Coconut Fiber</option>
                <option>Coconut Charcoal</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quality Grade</label>
              <select name="qualityGrade" value={formData.qualityGrade} onChange={handleChange}>
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Grade C</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Processing Status & Notes Section */}
        <fieldset>
          <legend>Processing Information</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="processingStatus" value={formData.processingStatus} onChange={handleChange}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
        </fieldset>

        {/* Processing Method Section */}
        <fieldset>
          <legend>Processing Method</legend>
          <div className="form-group">
            <select name="processingMethod" value={formData.processingMethod} onChange={handleChange}>
              <option>Mechanical</option>
              <option>Chemical</option>
              <option>Biological</option>
            </select>
          </div>
        </fieldset>

        {/* Form Actions (Cancel & Submit Buttons) */}
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => setFormData({
              batchId: '',
              totalWeight: '',
              collectionDate: '',
              sourceLocation: '',
              wasteType: 'Coconut Husk',
              qualityGrade: 'Grade A',
              processingStatus: 'Pending',
              processingMethod: 'Mechanical',
              notes: ''
            })}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn">Save Details</button>
        </div>

      </form>
    </div>
  );
};

export default CoconutWasteForm; // Export component for use in other files
