import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { api, database } from 'api'
import axios from 'axios'
import {
  StepDot,
  StepIndicator,
  StepLabel,
  StepLine,
  WizardActions,
  WizardContainer,
  WizardContent,
  WizardHeader,
  WizardTitle,
} from './styled'
import { Assignments, Confirmation, Format, Leagues, Players, PlayoffBracket } from './steps'
import { PageLoader, PrimaryLink } from 'views/components'

const TournamentCreation = () => {
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
      playoffBracket: [],
    },
  })

  const { watch, trigger } = methods
  const watchedFormat = watch('format')

  // Dynamic steps based on format
  const getSteps = () => {
    const baseSteps = [
      { id: 1, label: 'Formato', component: Format },
      { id: 2, label: 'Jugadores', component: Players },
      { id: 3, label: 'Ligas', component: Leagues },
    ]

    if (watchedFormat === 'playoff') {
      return [
        ...baseSteps,
        { id: 4, label: 'Bracket', component: PlayoffBracket },
        { id: 5, label: 'Confirmar', component: Confirmation },
      ]
    }

    return [
      ...baseSteps,
      { id: 4, label: 'Asignaciones', component: Assignments },
      { id: 5, label: 'Confirmar', component: Confirmation },
    ]
  }

  const STEPS = getSteps()

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
            <PrimaryLink asButton text={"Anterior"} type="button" onClick={prevStep} />
          )}
          {currentStep < STEPS.length && (
            <PrimaryLink asButton text={"Siguiente"} type="button" onClick={nextStep} />
          )}
        </WizardActions>
      </WizardContainer>
    </FormProvider>
  )
}

export default TournamentCreation
