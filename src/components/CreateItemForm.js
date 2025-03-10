import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Fab,
  Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const CreateItemForm = ({ apiUrl, fields, onItemAdded }) => {
  const initialFormState = fields.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload for image fields
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formDataUpload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // Automatically update the field value with the uploaded file URL
      setFormData((prev) => ({ ...prev, [fieldName]: response.data.filePath }));
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(apiUrl, formData);
      onItemAdded(); // refresh parent data
      handleClose();
    } catch (error) {
      console.error(
        "Error adding item:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      {/* Floating Action Button to open the form */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            {fields.map((field) => (
              <Box key={field.name} sx={{ mb: 2 }}>
                {field.name.toLowerCase().includes("image") ? (
                  <>
                    {formData[field.name] && (
                      <Box sx={{ mb: 1 }}>
                        <img
                          src={formData[field.name]}
                          alt={field.label}
                          style={{
                            width: "100%",
                            maxHeight: 200,
                            objectFit: "cover"
                          }}
                        />
                      </Box>
                    )}
                    <Button variant="outlined" component="label">
                      Upload {field.label}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileUpload(e, field.name)}
                      />
                    </Button>
                  </>
                ) : (
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateItemForm;
