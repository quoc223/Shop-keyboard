import "../style/style.scss"
import React, { useState } from 'react';
import Button from '@mui/material/Button';
const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleDelete = (e) => {
    setUploadedImageUrl('');
  }
  const handleUpload = async () => {
    if (!image) return;

    const apiKey = process.env.API_KEY_IMAGE;
    const url = process.env.URL_IMAGE;

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', image);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedImageUrl(data.data.url);
        console.log('Uploaded image URL:', data.data.url);
        alert('Upload image successfully!');
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
      <div className="uploadimg">
          <Button variant="text" component="label">
              Upload File
              <input type="file" onChange={handleImageChange}   />
          </Button>
          <Button onClick={handleUpload} variant="contained">
              Upload
          </Button>
          {uploadedImageUrl && <img className="uploadimged"  src={uploadedImageUrl} alt="Uploaded" />}
          
      </div>
  );
};

export default UploadImage;