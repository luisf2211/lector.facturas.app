"use client";
import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Snackbar } from '@mui/material';
import { validateScreen } from '@/app/utils/validateScreen';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';

function DocumentosScreen() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const isMobile = validateScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const handleImageChange = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const blob = new Blob([reader.result], { type: file.type });
      const url = URL.createObjectURL(blob);
      setImagePreview(url);
    };

    reader.onerror = () => {
      console.error('Hubo un error al leer el archivo');
    };

    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
    handleImageChange(acceptedFiles);
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop}); 

  const handlerRemoveFile = () => setFile(null);

  const handleLoadFile = () => {
    setIsLoading(true);
    setOpen(true);
    setMensaje('Cargando archivo');
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div style={{padding: 50}}>
      <Snackbar
        anchorOrigin={isMobile ? {vertical: 'top', horizontal: 'center'} : {vertical: 'bottom', horizontal: 'left'}}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert 
          variant={isMobile ? "filled" : "outlined"} 
          severity="info">
          {mensaje}
        </Alert>
      </Snackbar>
      
      <div style={{ textAlign: 'center' }}>
        <h2>
          Sube tu factura
        </h2>
        <p>
          Ingresa tu recibo con formato <strong>PNG</strong>, <strong>JPEG</strong> y <strong>JPG</strong>
        </p>
      </div>
      <br />
      {file === null || file === '' ? 
      <div {...getRootProps()} >
      <input {...getInputProps()}  />
      {
        isDragActive ?
        <div style={{
          border: '2px solid grey', 
          borderStyle: 'dashed', 
          width: '100%' , 
          height: '200px', 
          display: 'flex', 
          borderRadius: 10,
          margin: 'auto',
          cursor: 'pointer'
      }}
        >
          <p style={{
                margin: 'auto', 
                textAlign: 'center'
              }}>
                <p>
                  <UploadFileIcon sx={{ fontSize: 80 }}  />
                </p>
                <p>
                  Suelta tu archivo aqui
                </p>
          </p>
      </div>
          :
          <div style={{
              border: '2px solid grey', 
              borderStyle: 'dashed', 
              width: '100%' , 
              height: '200px', 
              display: 'flex', 
              borderRadius: 10,
              margin: 'auto',
              cursor: 'pointer'
          }}
            >
              <p style={{
                margin: 'auto',
              }}>
                Arrastra un archivo o <strong style={{color: '#1876D1'}}>búscalo</strong> en tu maquina.
              </p> 
          </div>
      }
      </div>
      :
        <div style={{ textAlign: 'center' }}>
          <div>
            <p>
              Archivo cargado: {file?.path}
            </p>
            <div style={{ height: '310px' }}>
              <img 
                src={imagePreview} 
                style={{
                  width: isMobile ? '100%' : '30%', 
                  height: '100%'
                }} 
                alt={`archivo ${file?.path}`} />
            </div>
            <br />
            <br />
            <div style={{display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center'}}>
              <Button variant="text" onClick={handlerRemoveFile} sx={{width: '200px', margin: 'auto'}} >Remover archivo</Button>
              <LoadingButton variant="contained" onClick={handleLoadFile} loading={isLoading} sx={{width: '200px', margin: 'auto'}} >Leer Archivo</LoadingButton>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default DocumentosScreen

