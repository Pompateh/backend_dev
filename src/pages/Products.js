import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, Card, CardContent, CardMedia, Typography, Grid, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box
} from "@mui/material";
import CreateItemForm from "../components/CreateItemForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const fetchProducts = () => {
    axios.get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please check your backend.");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setEditedProduct({ ...product });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setEditDialogOpen(false);
    setProductToDelete(null);
    setProductToEdit(null);
    setEditedProduct({});
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`)
        .then(() => {
          fetchProducts();
          setError(null);
        })
        .catch((error) => {
          console.error("Error deleting product:", error.response ? error.response.data : error.message);
          setError("Failed to delete product.");
        });
      handleCloseDialog();
    }
  };

  const handleConfirmEdit = () => {
    if (productToEdit) {
      axios.put(`http://localhost:5000/api/products/${productToEdit._id}`, editedProduct)
        .then(() => {
          fetchProducts();
          setError(null);
        })
        .catch((error) => {
          console.error("Error updating product:", error.response ? error.response.data : error.message);
          setError("Failed to update product.");
        });
      handleCloseDialog();
    }
  };

  // Individual file upload function
  const handleFileUpload = (event, imageField) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
  
      axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        setEditedProduct(prev => ({ ...prev, [imageField]: response.data.filePath }));
      })
      .catch(error => {
        console.error("Error uploading file:", error);
        setError("Failed to upload image.");
      });
    }
  };

  // Bulk upload function that updates the edited product's image fields
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
          // Update a predetermined set of image fields
          const updatedImages = { ...editedProduct };
          // Adjust the fields array as needed; here we update the main image and up to 4 additional images
          const fields = ['image', 'image1', 'image2', 'image3', 'image4'];
          filePaths.slice(0, fields.length).forEach((path, index) => {
            updatedImages[fields[index]] = path;
          });
          setEditedProduct(updatedImages);
        })
        .catch(error => {
          console.error("Bulk upload error:", error);
          setError("Failed to process bulk upload.");
        });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Products</Typography>
      <CreateItemForm
        apiUrl="http://localhost:5000/api/products"
        fields={[
          { name: "name", label: "Product Name" },
          { name: "image", label: "Main Image URL", type: "file" },
          { name: "image1", label: "Image 1 URL", type: "file" },
          { name: "image2", label: "Image 2 URL", type: "file" },
          { name: "image3", label: "Image 3 URL", type: "file" },
          { name: "image4", label: "Image 4 URL", type: "file" },
          { name: "price", label: "Price" },
          { name: "type", label: "Type" },
          { name: "story", label: "Story" }
        ]}
        onItemAdded={fetchProducts}
      />
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardMedia
                component="img"
                image={
                  product.image.startsWith('.')
                    ? `http://localhost:5000${product.image.substring(1)}`
                    : product.image
                }
                alt={product.name}
                sx={{ height: 150, objectFit: "cover" }}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Price: ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Type: {product.type}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Story: {product.story}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  onClick={() => handleEditClick(product)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={() => handleDeleteClick(product)}
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
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Confirm Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialog} aria-labelledby="edit-dialog-title">
        <DialogTitle id="edit-dialog-title">Edit Product</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="name" label="Product Name" type="text" fullWidth
            value={editedProduct.name || ''} onChange={handleInputChange} />
          {/* Bulk Upload Section */}
          <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }} fullWidth>
            Bulk Upload Images
            <input type="file" multiple hidden onChange={handleBulkUpload} />
          </Button>
          {['image', 'image1', 'image2', 'image3', 'image4'].map((imageField, index) => (
            <div key={imageField}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                {index === 0 ? 'Main Image' : `Image ${index}`}
              </Typography>
              {editedProduct[imageField] ? (
                <div>
                  <img 
                    src={editedProduct[imageField]} 
                    alt={`Product ${index}`} 
                    style={{ maxWidth: '100%', marginBottom: '10px' }} 
                  />
                  <Button variant="contained" component="label" fullWidth>
                    Replace Image
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, imageField)} />
                  </Button>
                </div>
              ) : (
                <Button variant="contained" component="label" fullWidth>
                  Upload Image
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, imageField)} />
                </Button>
              )}
            </div>
          ))}
          <TextField margin="dense" name="price" label="Price" type="number" fullWidth
            value={editedProduct.price || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="type" label="Type" type="text" fullWidth
            value={editedProduct.type || ''} onChange={handleInputChange} />
          <TextField margin="dense" name="story" label="Story" type="text" fullWidth multiline rows={4}
            value={editedProduct.story || ''} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmEdit} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
