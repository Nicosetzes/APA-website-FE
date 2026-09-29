import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import { Loader } from 'views/components'
import { Pagination } from '@mui/material'
import { api } from 'api'
import { apiClient } from 'api/axiosConfig'
import { motion } from 'framer-motion'
import {
  Caption,
  CloseButton,
  Container,
  EditCard,
  EditDate,
  EditsGrid,
  EditImage,
  EditInfo,
  EditInfoHeader,
  Header,
  Message,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalImage,
  SpinnerContainer,
  Subtitle,
  Title,
  UploadButtonLink,
  UserName,
  PaginationContainer,
  PaginationInfo,
} from './styled'
import { confirmDialog, toast } from 'utils/notifications'
import { format, parseISO } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Edits = () => {
  const [edits, setEdits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentPage = parseInt(searchParams.get('page')) || 1

  const fetchEdits = useCallback(
    async (signal) => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiClient.get(`${api}/edits`, {
          params: { page: currentPage },
          signal,
        })

        setEdits(response.data.data)
        setPagination(response.data.pagination)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error(err)
          setError('Error al cargar los edits')
        }
      } finally {
        setLoading(false)
      }
    },
    [currentPage],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchEdits(controller.signal)

    return () => controller.abort()
  }, [fetchEdits])

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageClick = (edit) => {
    setSelectedImage(edit)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  const handleDeleteEdit = async (editId) => {
    const confirmed = await confirmDialog({
      title: 'Eliminar edit',
      text: '¿Está seguro que desea eliminar este edit?',
      confirmText: 'Eliminar',
      cancelText: 'Volver',
      danger: true,
    })
    if (!confirmed) return

    try {
      await apiClient.delete(`${api}/edits/${editId}`)
      fetchEdits()
      toast.success({ title: 'Edit eliminado con éxito' })
    } catch (error) {
      toast.apiError(error, 'Error al eliminar el edit')
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <Header>
          <Title>Galería de Edits</Title>
          <Subtitle>Explora todos los edits de la comunidad APA</Subtitle>
          <UploadButtonLink onClick={() => navigate('/edits/upload')}>
            Subir Edit
          </UploadButtonLink>
        </Header>

        {error && <Message $error>{error}</Message>}

        {loading ? (
          <SpinnerContainer>
            <Loader />
          </SpinnerContainer>
        ) : edits.length === 0 ? (
          <Message>No hay edits disponibles</Message>
        ) : (
          <>
            <EditsGrid>
              {edits.map((edit) => (
                <EditCard key={edit._id}>
                  <EditImage
                    src={edit.url}
                    alt={edit.caption || 'Edit'}
                    onClick={() => handleImageClick(edit)}
                  />
                  <EditInfo>
                    <EditInfoHeader>
                      <div>
                        <UserName>
                          Subido por: {edit.user.nickname || edit.user.name}
                        </UserName>
                        {edit.caption && <Caption>{edit.caption}</Caption>}
                        <EditDate>
                          {format(
                            parseISO(edit.createdAt),
                            'dd/MM/yyyy hh:mm:ss a',
                          )}
                        </EditDate>
                      </div>
                      <IconButton
                        onClick={() => handleDeleteEdit(edit._id)}
                        aria-label="delete"
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </EditInfoHeader>
                  </EditInfo>
                </EditCard>
              ))}
            </EditsGrid>

            {pagination && pagination.totalPages > 1 && (
              <PaginationContainer>
                <PaginationInfo>
                  Página {pagination.currentPage} de {pagination.totalPages} (
                  {pagination.totalEdits} edits en total)
                </PaginationInfo>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </PaginationContainer>
            )}
          </>
        )}

        {selectedImage && (
          <Modal onClick={handleCloseModal}>
            <ModalOverlay />
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
              <ModalImage
                src={selectedImage.url}
                alt={selectedImage.caption || 'Edit'}
              />
            </ModalContent>
          </Modal>
        )}
      </Container>
    </motion.div>
  )
}

export default Edits
