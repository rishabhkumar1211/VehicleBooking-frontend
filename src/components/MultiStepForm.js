import React, { useState, useEffect } from "react";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Typography,
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.wheels) {
      axios
        .get(`http://localhost:3000/api/vehicle-types/${formData.wheels}`)
        .then((response) => setVehicleTypes(response.data))
        .catch(console.error);
    }
  }, [formData.wheels]);

  useEffect(() => {
    if (formData.vehicleType) {
      axios
        .get(`http://localhost:3000/api/vehicles/${formData.vehicleType}`)
        .then((response) => setVehicles(response.data))
        .catch(console.error);
    }
  }, [formData.vehicleType]);

  const handleNext = () => {
    if (validateStep()) {
      setError("");
      setStep(step + 1);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName;
      case 1:
        return formData.wheels;
      case 2:
        return formData.vehicleType;
      case 3:
        return formData.vehicleModel;
      case 4:
        return (
          formData.startDate &&
          formData.endDate &&
          new Date(formData.startDate) < new Date(formData.endDate)
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/book-vehicle",
        {
          vehicleId: formData.vehicleModel,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }
      );
      alert(response.data);
      setStep(0);
    } catch (error) {
      setError(error.response?.data || "Error booking vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const renderButton = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={step === 4 ? handleSubmit : handleNext}
      disabled={!validateStep() || loading}
    >
      {step === 4 ? "Submit" : "Next"}
    </Button>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "2rem",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Vehicle Booking Form
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        {step === 0 && (
          <>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}

        {step === 1 && (
          <RadioGroup
            name="wheels"
            value={formData.wheels}
            onChange={handleChange}
          >
            <FormControlLabel value="2" control={<Radio />} label="2 Wheels" />
            <FormControlLabel value="4" control={<Radio />} label="4 Wheels" />
          </RadioGroup>
        )}

        {step === 2 && (
          <RadioGroup
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          >
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
          <RadioGroup
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
          >
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
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
          </>
        )}

        {renderButton()}
      </Paper>
    </div>
  );
};

export default MultiStepForm;
