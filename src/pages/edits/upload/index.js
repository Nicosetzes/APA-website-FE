import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from 'api'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'
import {
  Container,
  Header,
  Title,
  Subtitle,
  BackButton,
  UploadCard,
  UploadArea,
  FileInput,
  FileLabel,
  FileName,
  PreviewImage,
  PreviewContainer,
  RemoveButton,
  UploadButton,
  Message,
  SpinnerContainer,
} from './styled'

const EditsUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const MAX_FILES = 10
  const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)

    if (files.length === 0) return

    // Validate total number of files (existing + new)
    const totalFiles = selectedFiles.length + files.length
    if (totalFiles > MAX_FILES) {
      setError(
        `No puedes agregar más imágenes. Máximo: ${MAX_FILES} imágenes (actualmente tienes ${selectedFiles.length})`,
      )
      event.target.value = '' // Reset input
      return
    }

    // Validate each file
    const validFiles = []
    const newPreviews = []
    let hasError = false

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(`El archivo "${file.name}" no es una imagen válida`)
        hasError = true
        break
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `El archivo "${file.name}" es demasiado grande. Tamaño máximo: 3MB`,
        )
        hasError = true
        break
      }

      validFiles.push(file)
    }

    if (hasError) {
      event.target.value = '' // Reset input
      return
    }

    // Append new files to existing ones
    setSelectedFiles([...selectedFiles, ...validFiles])
    setError(null)
    setMessage(null)

    // Create previews for new files
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push({ file, preview: reader.result })
        if (newPreviews.length === validFiles.length) {
          setPreviews((prev) => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input to allow selecting same file again
    event.target.value = ''
  }

  const handleRemoveImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)

    // Reset file input if no files left
    if (newFiles.length === 0) {
      document.getElementById('file-input').value = ''
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Por favor selecciona al menos una imagen')
      return
    }

    setUploading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData()
    selectedFiles.forEach((file) => {
      formData.append('image', file)
    })

    try {
      await axios.post(`${api}/edits`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        credentials: 'include',
      })

      setMessage(
        `¡${selectedFiles.length} ${
          selectedFiles.length === 1 ? 'imagen subida' : 'imágenes subidas'
        } exitosamente!`,
      )
      setSelectedFiles([])
      setPreviews([])
      // Reset file input
      document.getElementById('file-input').value = ''
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('No estás autorizado. Por favor inicia sesión.')
      } else {
        setError(err.response?.data?.message || 'Error al subir las imágenes')
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
          <BackButton onClick={() => navigate('/edits')}>
            ← Volver a la galería
          </BackButton>
        </Header>

        {message && <Message>{message}</Message>}
        {error && <Message $error>{error}</Message>}

        <UploadCard>
          <UploadArea>
            <FileInput
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
            />
            <FileLabel htmlFor="file-input" as="label">
              {selectedFiles.length > 0
                ? 'Agregar más imágenes'
                : 'Seleccionar imágenes'}
            </FileLabel>

            {selectedFiles.length > 0 && (
              <>
                <FileName>
                  {selectedFiles.length}{' '}
                  {selectedFiles.length === 1
                    ? 'imagen seleccionada'
                    : 'imágenes seleccionadas'}
                </FileName>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    justifyContent: 'center',
                  }}
                >
                  {previews.map((preview, idx) => (
                    <PreviewContainer key={idx}>
                      <PreviewImage
                        src={preview.preview}
                        alt={`Preview ${idx + 1}`}
                      />
                      <RemoveButton
                        onClick={() => handleRemoveImage(idx)}
                        disabled={uploading}
                        aria-label="Eliminar imagen"
                      >
                        ×
                      </RemoveButton>
                    </PreviewContainer>
                  ))}
                </div>
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
                disabled={selectedFiles.length === 0 || uploading}
              >
                Subir{' '}
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} ${
                      selectedFiles.length === 1 ? 'imagen' : 'imágenes'
                    }`
                  : 'imágenes'}
              </UploadButton>
            )}
          </UploadArea>
        </UploadCard>
      </Container>
    </motion.div>
  )
}

export default EditsUpload
