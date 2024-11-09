import React, { useState, useEffect } from "react";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import axios from "axios";

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: "",
    vehicleModel: "",
    startDate: "",
    endDate: "",
  });
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Load vehicle types based on wheels selection
  useEffect(() => {
    if (formData.wheels) {
      axios
        .get(`http://localhost:3000/api/vehicle-types/${formData.wheels}`)
        .then((response) => setVehicleTypes(response.data))
        .catch((error) => console.error(error));
    }
  }, [formData.wheels]);

  // Load specific vehicles based on type selection
  useEffect(() => {
    if (formData.vehicleType) {
      axios
        .get(`http://localhost:3000/api/vehicles/${formData.vehicleType}`)
        .then((response) => setVehicles(response.data))
        .catch((error) => console.error(error));
    }
  }, [formData.vehicleType]);

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    // Add specific validation logic
    return true;
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:3000/api/book-vehicle", formData);
      alert("Booking successful!");
    } catch (error) {
      alert("Error booking vehicle.");
    }
  };

  return (
    <div>
      {step === 0 && (
        <>
          <TextField
            label="First Name"
            name="firstName"
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            onChange={handleChange}
          />
        </>
      )}
      {step === 1 && (
        <RadioGroup name="wheels" onChange={handleChange}>
          <FormControlLabel value="2" control={<Radio />} label="2 Wheels" />
          <FormControlLabel value="4" control={<Radio />} label="4 Wheels" />
        </RadioGroup>
      )}
      {step === 2 && (
        <RadioGroup name="vehicleType" onChange={handleChange}>
          {vehicleTypes.map((type) => (
            <FormControlLabel
              key={type.id}
              value={type.id}
              control={<Radio />}
              label={type.name}
            />
          ))}
        </RadioGroup>
      )}
      {step === 3 && (
        <RadioGroup name="vehicleModel" onChange={handleChange}>
          {vehicles.map((vehicle) => (
            <FormControlLabel
              key={vehicle.id}
              value={vehicle.id}
              control={<Radio />}
              label={vehicle.model}
            />
          ))}
        </RadioGroup>
      )}
      {step === 4 && (
        <>
          <TextField
            type="date"
            label="Start Date"
            name="startDate"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            type="date"
            label="End Date"
            name="endDate"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </>
      )}
      <Button onClick={step === 4 ? handleSubmit : handleNext}>
        {step === 4 ? "Submit" : "Next"}
      </Button>
    </div>
  );
};

export default MultiStepForm;
