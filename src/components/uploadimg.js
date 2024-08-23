import "../style/style.scss";
import React, { useState } from 'react';
import Button from '@mui/material/Button';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Handle file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!image) return;

    const apiKey = process.env.REACT_APP_API_KEY_IMAGE;
    const url = process.env.REACT_APP_IMAGE_UPLOAD_URL;

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('action', 'upload');
    formData.append('source', image); // Ensure the key is correct as per the API docs
    formData.append('format', 'json');

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Adjust based on the actual API response structure
        setUploadedImageUrl(data.image.url);
        console.log('Uploaded image URL:', data.image.url);
        alert('Image uploaded successfully!');
      } else {
        console.error('Failed to upload image');
        alert('Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image.');
    }
  };

  // Handle image deletion
  const handleDelete = () => {
    setUploadedImageUrl('');
    setImage(null);
  };

  return (
    <div className="uploadimg">
      <Button variant="text" component="label">
        Upload File
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </Button>
      <Button onClick={handleUpload} variant="contained">
        Upload
      </Button>
      {uploadedImageUrl && (
        <div>
          <img className="uploadimged" src={uploadedImageUrl} alt="Uploaded" />
          <Button onClick={handleDelete} variant="outlined" color="error">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

export default UploadImage;
