import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, Card, CardContent, CardMedia, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import CreateItemForm from '../components/CreateItemForm';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedBrand, setEditedBrand] = useState({});
  const [brandToDelete, setBrandToDelete] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to fetch brands. Please try again.');
    }
  };

  const handleEditClick = (brand) => {
    setEditedBrand(brand);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setEditedBrand({});
    setBrandToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/brands/${brandToDelete._id}`);
        fetchBrands();
        handleCloseDialog();
      } catch (error) {
        console.error('Error deleting brand:', error);
        setError('Failed to delete brand. Please try again.');
      }
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/brands/${editedBrand._id}`, editedBrand);
      fetchBrands();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating brand:', error);
      setError('Failed to update brand. Please try again.');
    }
  };

  const handleFileUpload = async (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setEditedBrand(prev => ({ ...prev, [field]: response.data.filePath }));
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload file. Please try again.');
      }
    }
  };

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
          // Automatically assign the filePaths to image, gridImage1, gridImage2, gridImage3 in order.
          const updatedImages = { ...editedBrand };
          const fields = ['image', 'gridImage1', 'gridImage2', 'gridImage3'];
          filePaths.slice(0, fields.length).forEach((path, index) => {
            updatedImages[fields[index]] = path;
          });
          setEditedBrand(updatedImages);
        })
        .catch(error => {
          console.error("Bulk upload error:", error);
          setError("Bulk upload failed.");
        });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedBrand(prev => ({ ...prev, [name]: value }));
  };

  const getImageUrl = (path) => {
    return path && path.startsWith('http') ? path : `http://localhost:5000/${path}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Brands</Typography>
      <CreateItemForm
        apiUrl="http://localhost:5000/api/brands"
        fields={[
          { name: "name", label: "Brand Name" },
          { name: "image", label: "Image URL", type: "file" },
          { name: "story", label: "Story" },
          { name: "gridImage1", label: "Grid Image 1 URL", type: "file" },
          { name: "gridImage2", label: "Grid Image 2 URL", type: "file" },
          { name: "gridImage3", label: "Grid Image 3 URL", type: "file" },
          { name: "client", label: "Client" },
          { name: "publishedDate", label: "Published Date" }
        ]}
        onItemAdded={fetchBrands}
      />
      <Grid container spacing={3}>
        {brands.map((brand) => (
          <Grid item xs={12} sm={6} md={4} key={brand._id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={getImageUrl(brand.image)}
                alt={brand.name}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {brand.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Client: {brand.client}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  onClick={() => handleEditClick(brand)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={() => handleDeleteClick(brand)}
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
            Are you sure you want to delete the brand "{brandToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Confirm Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Brand Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">{"Edit Brand"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="name" label="Brand Name" type="text" fullWidth
            value={editedBrand.name || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="client" label="Client" type="text" fullWidth
            value={editedBrand.client || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="publishedDate" label="Published Date" type="text" fullWidth
            value={editedBrand.publishedDate || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="story" label="Story" type="text" fullWidth multiline rows={4}
            value={editedBrand.story || ''} onChange={handleInputChange} />
          
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
          {['image', 'gridImage1', 'gridImage2', 'gridImage3'].map((field, index) => (
            <Box key={field} sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {field === 'image' ? 'Main Image' : `Grid Image ${index}`}
              </Typography>
              {editedBrand[field] ? (
                <Box>
                  <img src={getImageUrl(editedBrand[field])} alt={`Brand ${field}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                  <Button variant="contained" component="label" fullWidth>
                    Replace Image
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, field)} />
                  </Button>
                </Box>
              ) : (
                <Button variant="contained" component="label" fullWidth>
                  Upload Image
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, field)} />
                </Button>
              )}
            </Box>
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

export default Brands;