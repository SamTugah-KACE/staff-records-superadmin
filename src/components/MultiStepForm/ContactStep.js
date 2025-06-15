import './ContactStep.css';

export default function ContactStep({ register, errors }) {
  return (
    <section className="form-section bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h2>
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="contact-form-group">
          <label className="block text-sm font-medium text-gray-700">Primary Contact Person*</label>
          <input
            type="text"
            {...register("contact_person")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.contact_person ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contact_person && (
            <span className="error-message text-red-500 text-sm">{errors.contact_person.message}</span>
          )}
        </div>
        
        <div className="contact-form-group">
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <input
            type="email"
            {...register("contact_email")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.contact_email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contact_email && (
            <span className="error-message text-red-500 text-sm">{errors.contact_email.message}</span>
          )}
        </div>
        
        <div className="contact-form-group">
          <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
          <input
            type="tel"
            {...register("phone_number")}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.phone_number ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone_number && (
            <span className="error-message text-red-500 text-sm">{errors.phone_number.message}</span>
          )}
        </div>
      </div>
    </section>
  );
}