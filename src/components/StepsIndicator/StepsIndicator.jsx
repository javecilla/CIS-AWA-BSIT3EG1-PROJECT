import './StepsIndicator.css'

export default function StepsIndicator({
  steps = [],
  currentStep = 1,
  className = ''
}) {
  const getStepState = (stepIndex) => {
    const stepNumber = stepIndex + 1
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'active'
    return ''
  }

  return (
    <div
      className={`d-flex justify-content-center align-items-center gap-2 mx-4 ${className}`}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const state = getStepState(index)
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="d-flex align-items-center">
            <div className="text-center">
              <div className={`step-circle ${state}`}>{stepNumber}</div>
              <p className="small fw-medium mt-2">{step.label}</p>
            </div>
            {!isLast && (
              <div className="flex-grow-0 mx-3 border-top border-2 step-line" />
            )}
          </div>
        )
      })}
    </div>
  )
}
