import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { api, database } from './../../api'
import axios from 'axios'
import {
  WizardContainer,
  WizardHeader,
  WizardTitle,
  StepIndicator,
  StepDot,
  StepLine,
  StepLabel,
  WizardContent,
  WizardActions,
  WizardButton,
} from './styled'
import StepFormat from './steps/StepFormat'
import StepPlayers from './steps/StepPlayers'
import StepLeagues from './steps/StepLeagues'
import StepAssignments from './steps/StepAssignments'
import StepConfirmation from './steps/StepConfirmation'
import PageLoader from '../../components/PageLoader'

const STEPS = [
  { id: 1, label: 'Formato', component: StepFormat },
  { id: 2, label: 'Jugadores', component: StepPlayers },
  { id: 3, label: 'Ligas', component: StepLeagues },
  { id: 4, label: 'Asignaciones', component: StepAssignments },
  { id: 5, label: 'Confirmar', component: StepConfirmation },
]

const CreateTournament = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [players, setPlayers] = useState([])
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      tournamentName: '',
      format: '',
      selectedPlayers: [],
      selectedLeagues: [],
      selectedTeams: [],
      teamsData: [],
      teamAssignments: [],
    },
  })

  const { watch, trigger } = methods
  const watchedFormat = watch('format')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, leaguesRes] = await Promise.all([
          axios.get(`${api}/users`),
          axios.get(`${database}/leagues`),
        ])
        setPlayers(playersRes.data)
        setLeagues(leaguesRes.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const nextStep = async () => {
    const isValid = await trigger()
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  if (loading) {
    return <PageLoader />
  }

  return (
    <FormProvider {...methods}>
      <WizardContainer>
        <WizardHeader>
          <WizardTitle>Crear Nuevo Torneo</WizardTitle>
          <StepIndicator>
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <StepDot
                    $active={currentStep === step.id}
                    $completed={currentStep > step.id}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </StepDot>
                  <StepLabel $active={currentStep === step.id}>
                    {step.label}
                  </StepLabel>
                </div>
                {index < STEPS.length - 1 && (
                  <StepLine $completed={currentStep > step.id} />
                )}
              </div>
            ))}
          </StepIndicator>
        </WizardHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WizardContent>
              <CurrentStepComponent
                players={players}
                leagues={leagues}
                format={watchedFormat}
              />
            </WizardContent>
          </motion.div>
        </AnimatePresence>

        <WizardActions>
          {currentStep > 1 && (
            <WizardButton type="button" onClick={prevStep} $variant="secondary">
              Anterior
            </WizardButton>
          )}
          {currentStep < STEPS.length && (
            <WizardButton type="button" onClick={nextStep} $variant="primary">
              Siguiente
            </WizardButton>
          )}
        </WizardActions>
      </WizardContainer>
    </FormProvider>
  )
}

export default CreateTournament
