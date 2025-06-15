import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import OrganizationStep from "./OrganizationStep";
import ContactStep from "./ContactStep";
import ProgressBar from "./ProgressBar";
import SuccessView from "./SuccessView";
import './MultiStepForm.css'

const schema = yup.object().shape({
  organization_name: yup.string().required("Organization name is required"),
  organization_email: yup.string().email("Invalid email").required("Email is required"),
  org_type: yup.string().required("Organization type is required"),
  organization_nature: yup.string().required("Organization nature is required"),
  country: yup.string().required("Country is required"),
  domain: yup.string().url("Must be a valid URL").required("Domain is required"),
  employee_range: yup.number().typeError("Must be a number").required("Employee count is required"),
  subscription_plan: yup.string(),
  contact_person: yup.string().required("Contact person is required"),
  contact_email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
});

const API_BASE_URL = "https://staff-records-backend.onrender.com/api";

export default function MultiStepForm({ onOrganizationCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [logoFiles, setLogoFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [newOrgId, setNewOrgId] = useState(null);
  
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { organization_nature: "" }
  });

  const handleLogoUpload = (acceptedFiles) => {
  console.log("🔴 handleLogoUpload called!", acceptedFiles);
  console.log("🔴 Number of files:", acceptedFiles?.length);
  
  if (acceptedFiles && acceptedFiles.length > 0) {
    console.log("🔴 First file details:", {
      name: acceptedFiles[0].name,
      size: acceptedFiles[0].size,
      type: acceptedFiles[0].type
    });
  }
  
  setLogoFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
};

  const removeLogoFile = (indexToRemove) => {
    setLogoFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ["organization_name", "organization_email", "org_type", "organization_nature", "country", "domain", "employee_range"] 
      : ["contact_person", "contact_email", "phone_number"];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
      setSubmitError("");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setSubmitError("");
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      
      const formData = new FormData();
      
      // Append form data
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

       console.log('Logo files to upload:', logoFiles);
      
      // Append logo files
      logoFiles.forEach((file, index) => {
        console.log(`Appending logo ${index}:`, file.name, file.size, file.type);
        formData.append('logos', file);
      });

      for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
      }

      const response = await axios.post(`${API_BASE_URL}/organizations/`, formData, {
        headers: { 
          ...(localStorage.getItem('access_token') && {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          })
        },
        timeout: 30000,
      });

      

      const newId = response.data.id || response.data._id;
      setNewOrgId(newId);
      setSubmitSuccess(true);
      
      // Notify parent component
      if (onOrganizationCreated) {
        onOrganizationCreated(response.data);
      }
      
      // Reset form
      reset();
      setLogoFiles([]);
      setCurrentStep(1);
      
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.detail || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      }
      
      setSubmitError(errorMessage);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <SuccessView 
        newOrgId={newOrgId}
        onRegisterAnother={() => {
          setSubmitSuccess(false);
          setCurrentStep(1);
          setSubmitError("");
        }}
        onViewOrganizations={() => navigate('/organizations')}
      />
    );
  }

  return (
    <div className="form-container max-w-4xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">Organization Registration</h1>
      
      <ProgressBar currentStep={currentStep} totalSteps={2} />
      
      {submitError && (
      <div className="error-message mb-2 p-2 bg-red-50 border-l-4 border-red-300 text-red-600 text-sm rounded-r">
        <span>{submitError}</span>
      </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <OrganizationStep 
            register={register}
            errors={errors}
            logoFiles={logoFiles}
            onLogoUpload={handleLogoUpload}
            onRemoveLogo={removeLogoFile}
          />
        )}
        
        {currentStep === 2 && (
          <ContactStep 
            register={register}
            errors={errors}
          />
        )}
        
        <div className="form-navigation flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}
          
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto disabled:opacity-50"
              disabled={isSubmitting}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-auto flex items-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Submit Registration"}
            </button>
          )}
        </div>
      </form>
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Submitting your organization registration...</p>
          </div>
        </div>
      )}
    </div>
  );
}