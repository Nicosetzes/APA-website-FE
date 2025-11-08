import { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from './../../api'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'
import {
  Container,
  Header,
  Title,
  Subtitle,
  UploadCard,
  UploadArea,
  FileInput,
  FileLabel,
  FileName,
  PreviewImage,
  UploadButton,
  Message,
  SpinnerContainer,
} from './styled'

const Edits = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido')
        setSelectedFile(null)
        setPreview(null)
        return
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Tamaño máximo: 5MB')
        setSelectedFile(null)
        setPreview(null)
        return
      }

      setSelectedFile(file)
      setError(null)
      setMessage(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen primero')
      return
    }

    setUploading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      await axios.post(`${api}/edits`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        credentials: 'include',
      })

      setMessage('¡Imagen subida exitosamente!')
      setSelectedFile(null)
      setPreview(null)
      // Reset file input
      document.getElementById('file-input').value = ''
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('No estás autorizado. Por favor inicia sesión.')
      } else {
        setError(err.response?.data?.message || 'Error al subir la imagen')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <Header>
          <Title>Subir Edits</Title>
          <Subtitle>Sube imágenes para la galería de edits</Subtitle>
        </Header>

        {message && <Message>{message}</Message>}
        {error && <Message $error>{error}</Message>}

        <UploadCard>
          <UploadArea>
            <FileInput
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <FileLabel htmlFor="file-input" as="label">
              {selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
            </FileLabel>

            {selectedFile && (
              <>
                <FileName>{selectedFile.name}</FileName>
                {preview && <PreviewImage src={preview} alt="Preview" />}
              </>
            )}

            {uploading ? (
              <SpinnerContainer>
                <Oval
                  height="60"
                  width="60"
                  color="var(--blue-900)"
                  ariaLabel="uploading"
                />
              </SpinnerContainer>
            ) : (
              <UploadButton
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                Subir imagen
              </UploadButton>
            )}
          </UploadArea>
        </UploadCard>
      </Container>
    </motion.div>
  )
}

export default Edits
