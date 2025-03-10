import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, Card, CardContent, CardMedia, Typography, Grid, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField 
} from "@mui/material";
import CreateItemForm from "../components/CreateItemForm";

const Illustrations = () => {
  const [illustrations, setIllustrations] = useState([]);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [illustrationToDelete, setIllustrationToDelete] = useState(null);
  const [illustrationToEdit, setIllustrationToEdit] = useState(null);
  const [editedIllustration, setEditedIllustration] = useState({});

  const fetchIllustrations = () => {
    axios.get("http://localhost:5000/api/illustrations")
      .then((response) => {
        setIllustrations(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching illustrations:", error);
        setError("Failed to fetch illustrations. Please check your backend.");
      });
  };

  useEffect(() => {
    fetchIllustrations();
  }, []);

  const handleDeleteClick = (illustration) => {
    setIllustrationToDelete(illustration);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (illustration) => {
    setIllustrationToEdit(illustration);
    setEditedIllustration({ ...illustration });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setEditDialogOpen(false);
    setIllustrationToDelete(null);
    setIllustrationToEdit(null);
    setEditedIllustration({});
  };

  const handleConfirmDelete = () => {
    if (illustrationToDelete) {
      deleteIllustration(illustrationToDelete._id);
      handleCloseDialog();
    }
  };

  const handleConfirmEdit = () => {
    if (illustrationToEdit) {
      updateIllustration(illustrationToEdit._id, editedIllustration);
      handleCloseDialog();
    }
  };

  const deleteIllustration = (id) => {
    axios.delete(`http://localhost:5000/api/illustrations/${id}`)
      .then(() => {
        fetchIllustrations();
        setError(null);
      })
      .catch((error) => {
        console.error("Error deleting illustration:", error.response ? error.response.data : error.message);
        setError("Failed to delete illustration.");
      });
  };

  const updateIllustration = (id, updatedIllustration) => {
    axios.put(`http://localhost:5000/api/illustrations/${id}`, updatedIllustration)
      .then(() => {
        fetchIllustrations();
        setError(null);
      })
      .catch((error) => {
        console.error("Error updating illustration:", error.response ? error.response.data : error.message);
        setError("Failed to update illustration.");
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
        setEditedIllustration(prev => ({ ...prev, [field]: response.data.filePath }));
      })
      .catch(error => {
        console.error("Error uploading file:", error);
        setError("Failed to upload file.");
      });
    }
  };

  // Updated bulk upload function: updates the edited illustration's image fields
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
          // For example, update main image and additional images:
          const updatedImages = { ...editedIllustration };
          // Adjust the target fields as needed; here we update "image", "image1", "image2", etc.
          const fields = ['image', 'image1', 'image2', 'image3'];
          filePaths.slice(0, fields.length).forEach((path, index) => {
            updatedImages[fields[index]] = path;
          });
          setEditedIllustration(updatedImages);
        })
        .catch(error => {
          console.error("Bulk upload error:", error);
          setError("Failed to process bulk upload.");
        });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedIllustration(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Illustrations</Typography>
      <CreateItemForm
        apiUrl="http://localhost:5000/api/illustrations"
        fields={[
          { name: "name", label: "Product Name" },
          { name: "image", label: "Main Image URL", type: "file" },
          { name: "image1", label: "Image 1 URL", type: "file" },
          { name: "image2", label: "Image 2 URL", type: "file" },
          { name: "image3", label: "Image 3 URL", type: "file" },
          { name: "price", label: "Price" },
          { name: "description", label: "Description" },
          { name: "artist", label: "Artist" },
          { name: "year", label: "Year" },
          { name: "style", label: "Style" }
        ]}
        onItemAdded={fetchIllustrations}
      />
      <Grid container spacing={3}>
        {illustrations.map((illustration) => (
          <Grid item xs={12} sm={6} md={4} key={illustration._id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={illustration.image || illustration.image1 || 'placeholder-image-url'}
                alt={illustration.name}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {illustration.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Artist: {illustration.artist}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Year: {illustration.year}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Style: {illustration.style}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  onClick={() => handleEditClick(illustration)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={() => handleDeleteClick(illustration)}
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
            Are you sure you want to delete the illustration "{illustrationToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Confirm Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Illustration Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialog} aria-labelledby="edit-dialog-title">
        <DialogTitle id="edit-dialog-title">{"Edit Illustration"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="name" label="Product Name" type="text" fullWidth
            value={editedIllustration.name || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="artist" label="Artist" type="text" fullWidth
            value={editedIllustration.artist || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="publicOn" label="Public On" type="text" fullWidth
            value={editedIllustration.publicOn || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline rows={3}
            value={editedIllustration.description || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="year" label="Year" type="text" fullWidth
            value={editedIllustration.year || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="style" label="Style" type="text" fullWidth
            value={editedIllustration.style || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="price" label="Price" type="number" fullWidth
            value={editedIllustration.price || ''} onChange={handleInputChange} />

          {/* Bulk Upload Section */}
          <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }} fullWidth>
            Bulk Upload Images
            <input type="file" multiple hidden onChange={handleBulkUpload} />
          </Button>

          {/* Individual Image Uploads */}
          {['image', 'image1', 'image2', 'image3'].map((field, index) => (
            <div key={field}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                {index === 0 ? 'Main Image' : `Image ${index}`}
              </Typography>
              {editedIllustration[field] ? (
                <div>
                  <img 
                    src={editedIllustration[field]} 
                    alt={`Illustration ${field}`} 
                    style={{ maxWidth: '100%', marginBottom: '10px' }} 
                  />
                  <Button variant="contained" component="label" fullWidth>
                    Replace {index === 0 ? 'Main Image' : `Image ${index}`}
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, field)} />
                  </Button>
                </div>
              ) : (
                <Button variant="contained" component="label" fullWidth>
                  Upload {index === 0 ? 'Main Image' : `Image ${index}`}
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, field)} />
                </Button>
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmEdit} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Illustrations;
