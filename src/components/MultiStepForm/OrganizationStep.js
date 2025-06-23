import LogoUpload from "./LogoUpload";
import './OrganizationStep.css';

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Bahamas",
  "Behrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia & Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada", 
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Costa Rica",
  "Côte d’Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Eqypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India", 
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Maozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia",
  "Norway","Oman","Pakistan","Panama","Paragua","Peru","Philippines","Poland",
  "Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts & Nevis","Saint Lucia","Saint Vincent & the Grenadines",
  "Samoa","San Marino","Sao Tome & Principe", "Saudi Arabia","Senegal",
  "Serbia","Seychelles","Sierra Leone",
  "Singapore","Slovakia","Slovenia","Somalia","South Africa","Spain",
  "Sri Lanka","Sudan","Sudan, South","Suriname","Sweden",
  "Switzerland","Syria","Taiwan","Tanzania","Thailand","Togo",
  "Tonga","Trinidad & Tobago","Tunisia","Turkey","Uganda",
  "Ukraine","United Arab Emirates",
  "United Kingdom", "United States",
  "Uruguay","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe",

];

export default function OrganizationStep({ register, errors, logoFiles, onLogoUpload, onRemoveLogo }) {
  return (
    <section className="form-section bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Organization Details</h2>
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Organization Name*</label>
          <input
            type="text"
            {...register("organization_name")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.organization_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.organization_name && (
            <span className="error-message text-red-500 text-sm">{errors.organization_name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Organization Email*</label>
          <input
            type="email"
            {...register("organization_email")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.organization_email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.organization_email && (
            <span className="error-message text-red-500 text-sm">{errors.organization_email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Organization Type*</label>
          <select
            {...register("org_type")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.org_type ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select...</option>
            <option value="NGO">NGO</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            
          </select>
          {errors.org_type && (
            <span className="error-message text-red-500 text-sm">{errors.org_type.message}</span>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Nature of Organization*</label>
          <select
            {...register("organization_nature")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.organization_nature ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select...</option>
            <option value="Single Managed">Single Managed</option>
            <option value="Branch Managed">Branch Managed</option>
          </select>
          {errors.organization_nature && (
            <span className="error-message text-red-500 text-sm">{errors.organization_nature.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Country*</label>
          <select
            {...register("country")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Country</option>
          {countries.map((country, index) => (
            <option key={`${country}-${index}`} value={country}>{country}</option>
          ))}
          </select>
          {errors.country && (
            <span className="error-message text-red-500 text-sm">{errors.country.message}</span>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Domain*</label>
          <input
            type="url"
            {...register("domain")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.domain ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.domain && (
            <span className="error-message text-red-500 text-sm">{errors.domain.message}</span>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Number of Employees*</label>
          <input
            type="number"
            {...register("employee_range")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.employee_range ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.employee_range && (
            <span className="error-message text-red-500 text-sm">{errors.employee_range.message}</span>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
          <select
            {...register("subscription_plan")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.subscription_plan ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select...</option>
            <option value="Free">Free</option>
            <option value="Basic">Basic ($10/month)</option>
            <option value="Premium">Premium ($25/month)</option>
          </select>
        </div>
        
        <div className="md:col-span-2 form-group">
          <label className="block text-sm font-medium text-gray-700">Organization Logo</label>
          <LogoUpload
            onDrop={onLogoUpload}
            accept={{
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/png': ['.png'],
              'image/svg+xml': ['.svg']
            }}
            title="Drag & drop your logo here"
            description="Accepts PNG, JPG, JPEG up to 2MB"
            multiple
            uploadedFiles={logoFiles}
            onRemoveFile={onRemoveLogo}
          />
        </div>
      </div>
    </section>
  );
}