import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, Card, CardContent, CardMedia, Typography, Grid, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box
} from "@mui/material";
import CreateItemForm from "../components/CreateItemForm";

// Helper function to get full image URL.
const getImageUrl = (url) => {
  if (!url) return '';
  // If the URL already starts with http, return it as-is.
  return url.startsWith('http') ? url : `http://localhost:5000/${url}`;
};

const Typefaces = () => {
  const [typefaces, setTypefaces] = useState([]);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [typefaceToDelete, setTypefaceToDelete] = useState(null);
  const [typefaceToEdit, setTypefaceToEdit] = useState(null);
  const [editedTypeface, setEditedTypeface] = useState({});

  const fetchTypefaces = () => {
    axios.get("http://localhost:5000/api/typefaces")
      .then((response) => {
        setTypefaces(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching typefaces:", error);
        setError("Failed to fetch typefaces. Please check your backend.");
      });
  };

  useEffect(() => {
    fetchTypefaces();
  }, []);

  const handleDeleteClick = (typeface) => {
    setTypefaceToDelete(typeface);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (typeface) => {
    setTypefaceToEdit(typeface);
    setEditedTypeface({ ...typeface });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setEditDialogOpen(false);
    setTypefaceToDelete(null);
    setTypefaceToEdit(null);
    setEditedTypeface({});
  };

  const handleConfirmDelete = () => {
    if (typefaceToDelete) {
      deleteTypeface(typefaceToDelete._id);
      handleCloseDialog();
    }
  };

  const handleConfirmEdit = () => {
    if (typefaceToEdit) {
      updateTypeface(typefaceToEdit._id, editedTypeface);
      handleCloseDialog();
    }
  };

  const deleteTypeface = (id) => {
    axios.delete(`http://localhost:5000/api/typefaces/${id}`)
      .then(() => {
        fetchTypefaces();
        setError(null);
      })
      .catch((error) => {
        console.error("Error deleting typeface:", error.response ? error.response.data : error.message);
        setError("Failed to delete typeface.");
      });
  };

  const updateTypeface = (id, updatedTypeface) => {
    axios.put(`http://localhost:5000/api/typefaces/${id}`, updatedTypeface)
      .then(() => {
        fetchTypefaces();
        setError(null);
      })
      .catch((error) => {
        console.error("Error updating typeface:", error.response ? error.response.data : error.message);
        setError("Failed to update typeface.");
      });
  };

  // Individual file upload function (used in both create and edit dialogs)
  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        setEditedTypeface(prev => ({ ...prev, [field]: response.data.filePath }));
      })
      .catch(error => {
        console.error("Error uploading file:", error);
        setError("Failed to upload file.");
      });
    }
  };

  // Bulk upload function for multiple files at once.
  const handleBulkUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        return axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => res.data.filePath);
      });
      Promise.all(uploadPromises)
        .then(filePaths => {
          // Automatically assign the filePaths to image1, image2, ... in order.
          const updatedImages = { ...editedTypeface };
          const fields = ['image1', 'image2', 'image3', 'image4', 'image5'];
          filePaths.slice(0, fields.length).forEach((path, index) => {
            updatedImages[fields[index]] = path;
          });
          setEditedTypeface(updatedImages);
        })
        .catch(error => {
          console.error("Bulk upload error:", error);
          setError("Bulk upload failed.");
        });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedTypeface(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Typefaces</Typography>
      <CreateItemForm
        apiUrl="http://localhost:5000/api/typefaces"
        fields={[
          { name: "name", label: "Typeface Name" },
          { name: "designer", label: "Designer" },
          { name: "publicOn", label: "Public On" },
          { name: "version", label: "Version" },
          { name: "updateDate", label: "Update Date" },
          { name: "story", label: "Story" },
          { name: "features", label: "Features" },
          { name: "image", label: "Image_main URL", type: "file" },
          { name: "image1", label: "Image 1 URL", type: "file" },
          { name: "image2", label: "Image 2 URL", type: "file" },
          { name: "image3", label: "Image 3 URL", type: "file" },
          { name: "image4", label: "Image 4 URL", type: "file" },
          { name: "image5", label: "Image 5 URL", type: "file" },
          { name: "fontFile", label: "Font File", type: "file" }
        ]}
        onItemAdded={fetchTypefaces}
      />
      <Grid container spacing={3}>
        {typefaces.map((typeface) => (
          <Grid item xs={12} sm={6} md={4} key={typeface._id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={
                  // Check if the main image is available. If not, fallback to image1.
                  getImageUrl(typeface.image || typeface.image1 || 'placeholder-image-url')
                }
                alt={typeface.name}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {typeface.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Designer: {typeface.designer}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  onClick={() => handleEditClick(typeface)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={() => handleDeleteClick(typeface)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the typeface "{typefaceToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Confirm Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Typeface Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">{"Edit Typeface"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="name" label="Typeface Name" type="text" fullWidth
            value={editedTypeface.name || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="designer" label="Designer" type="text" fullWidth
            value={editedTypeface.designer || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="publicOn" label="Public On" type="text" fullWidth
            value={editedTypeface.publicOn || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="version" label="Version" type="text" fullWidth
            value={editedTypeface.version || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="updateDate" label="Update Date" type="text" fullWidth
            value={editedTypeface.updateDate || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="story" label="Story" type="text" fullWidth multiline rows={4}
            value={editedTypeface.story || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="features" label="Features" type="text" fullWidth
            value={editedTypeface.features || ''} onChange={handleInputChange} />
          
          {/* Main Image Preview */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Main Image</Typography>
            {editedTypeface.image ? (
              <Box>
                <img src={getImageUrl(editedTypeface.image)} alt="Main Typeface" style={{ maxWidth: '100%', marginBottom: '10px' }} />
                <Button variant="contained" component="label" fullWidth>
                  Replace Main Image
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, 'image')} />
                </Button>
              </Box>
            ) : (
              <Button variant="contained" component="label" fullWidth>
                Upload Main Image
                <input type="file" hidden onChange={(e) => handleFileUpload(e, 'image')} />
              </Button>
            )}
          </Box>

          {/* Bulk Upload Section */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Bulk Upload Images (select multiple files)
            </Typography>
            <Button variant="contained" component="label" fullWidth>
              Bulk Upload Images
              <input type="file" multiple hidden onChange={handleBulkUpload} />
            </Button>
          </Box>

          {/* Individual Image Uploads */}
          <Box sx={{ mt: 2 }}>
            {['image1', 'image2', 'image3', 'image4', 'image5'].map((field, index) => (
              <Box key={field} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Image {index + 1}</Typography>
                {editedTypeface[field] ? (
                  <Box>
                    <img src={getImageUrl(editedTypeface[field])} alt={`Typeface ${field}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                    <Button variant="contained" component="label" fullWidth>
                      Replace Image {index + 1}
                      <input type="file" hidden onChange={(e) => handleFileUpload(e, field)} />
                    </Button>
                  </Box>
                ) : (
                  <Button variant="contained" component="label" fullWidth>
                    Upload Image {index + 1}
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, field)} />
                  </Button>
                )}
              </Box>
            ))}
          </Box>

          {/* Font File Upload */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Font File</Typography>
            {editedTypeface.fontFile ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Current file: {editedTypeface.fontFile}
                </Typography>
                <Button variant="contained" component="label" fullWidth>
                  Replace Font File
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, 'fontFile')} />
                </Button>
              </Box>
            ) : (
              <Button variant="contained" component="label" fullWidth>
                Upload Font File
                <input type="file" hidden onChange={(e) => handleFileUpload(e, 'fontFile')} />
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmEdit} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Typefaces;
