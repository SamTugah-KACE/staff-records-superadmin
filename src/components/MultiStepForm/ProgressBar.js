import './ProgressBar.css'


export default function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="progress-bar relative mb-10">
      <div className="steps-container flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className={`step flex flex-col items-center relative ${
              index + 1 === currentStep ? "active" : ""
            } ${index + 1 < currentStep ? "completed" : ""}`}
          >
            <div 
              className={`step-number w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                index + 1 === currentStep 
                  ? "bg-blue-600" 
                  : index + 1 < currentStep 
                  ? "bg-green-500" 
                  : "bg-gray-300"
              }`}
            >
              {index + 1 < currentStep ? "✓" : index + 1}
            </div>
            <span className="step-name text-xs mt-1 text-gray-600">
              {index === 0 ? "Organization" : "Contact"}
            </span>
          </div>
        ))}
      </div>
      
      <div className="progress-line absolute top-4 left-0 h-0.5 bg-gray-200 w-full -z-10"></div>
      <div 
        className="progress-line-fill absolute top-4 left-0 h-0.5 bg-blue-500 -z-10 transition-all duration-300"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      ></div>
    </div>
  );
}