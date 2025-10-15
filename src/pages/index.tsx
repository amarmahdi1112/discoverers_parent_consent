import { useState } from "react";
import Head from "next/head";
import { SignaturePad } from "~/components/SignaturePad";
import { api } from "~/utils/api";

export default function Home() {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDateOfBirth: "",
    parentFullName: "",
    parentPhoneNumber: "",
    emergencyContactInfo: "",
    allergiesMedicalConditions: "",
    permissionToParticipate: false,
    emergencyMedicalAuth: false,
    photoVideoRelease: false,
    signature: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createSubmission = api.submission.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({
        childFullName: "",
        childDateOfBirth: "",
        parentFullName: "",
        parentPhoneNumber: "",
        emergencyContactInfo: "",
        allergiesMedicalConditions: "",
        permissionToParticipate: false,
        emergencyMedicalAuth: false,
        photoVideoRelease: false,
        signature: "",
      });
    },
    onError: (error) => {
      alert("Error submitting form: " + error.message);
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.childFullName.trim()) newErrors.childFullName = "Required";
    if (!formData.childDateOfBirth) {
      newErrors.childDateOfBirth = "Required";
    } else {
      const date = new Date(formData.childDateOfBirth);
      if (isNaN(date.getTime())) {
        newErrors.childDateOfBirth = "Invalid date";
      }
    }
    if (!formData.parentFullName.trim()) newErrors.parentFullName = "Required";
    if (!formData.parentPhoneNumber.trim()) newErrors.parentPhoneNumber = "Required";
    if (!formData.emergencyContactInfo.trim()) newErrors.emergencyContactInfo = "Required";
    if (!formData.signature) newErrors.signature = "Signature is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill in all required fields and provide your signature.");
      return;
    }

    createSubmission.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Head>
          <title>Thank You - Daycare Consent Form</title>
        </Head>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your consent form has been submitted successfully. We have received your information and will keep it on file.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Discoverers' Daycare - Consent Form</title>
        <meta name="description" content="Discoverers' Daycare parent consent and authorization form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white">
                  Discoverers' Daycare
                </h1>
                <div className="h-1 w-32 bg-amber-400 mx-auto rounded-full"></div>
                <p className="text-xl text-blue-100 font-medium pt-2">
                  Parent Consent & Authorization Form
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
              {/* Child Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Child Information
                </h2>
                
                <div>
                  <label htmlFor="childFullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Child's Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="childFullName"
                    value={formData.childFullName}
                    onChange={(e) => setFormData({ ...formData, childFullName: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.childFullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label htmlFor="childDateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="childDateOfBirth"
                    value={formData.childDateOfBirth}
                    onChange={(e) => setFormData({ ...formData, childDateOfBirth: e.target.value })}
                    min="2000-01-01"
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2 border ${errors.childDateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.childDateOfBirth && (
                    <p className="text-sm text-red-500 mt-1">{errors.childDateOfBirth}</p>
                  )}
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Parent/Guardian Information
                </h2>
                
                <div>
                  <label htmlFor="parentFullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="parentFullName"
                    value={formData.parentFullName}
                    onChange={(e) => setFormData({ ...formData, parentFullName: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.parentFullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label htmlFor="parentPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="parentPhoneNumber"
                    value={formData.parentPhoneNumber}
                    onChange={(e) => setFormData({ ...formData, parentPhoneNumber: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.parentPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Information <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContactInfo"
                    value={formData.emergencyContactInfo}
                    onChange={(e) => setFormData({ ...formData, emergencyContactInfo: e.target.value })}
                    placeholder="Name and phone number"
                    className={`w-full px-4 py-2 border ${errors.emergencyContactInfo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Medical Information
                </h2>
                
                <div>
                  <label htmlFor="allergiesMedicalConditions" className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies/Medical Conditions
                  </label>
                  <textarea
                    id="allergiesMedicalConditions"
                    value={formData.allergiesMedicalConditions}
                    onChange={(e) => setFormData({ ...formData, allergiesMedicalConditions: e.target.value })}
                    rows={3}
                    placeholder="Please list any allergies or medical conditions we should be aware of"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Permissions & Authorizations
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissionToParticipate}
                      onChange={(e) => setFormData({ ...formData, permissionToParticipate: e.target.checked })}
                      className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I give permission for my child to participate in daycare activities
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emergencyMedicalAuth}
                      onChange={(e) => setFormData({ ...formData, emergencyMedicalAuth: e.target.checked })}
                      className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I authorize emergency medical treatment if needed
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo/Video Release
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="photoVideoRelease"
                        checked={formData.photoVideoRelease === true}
                        onChange={() => setFormData({ ...formData, photoVideoRelease: true })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Yes, I consent to photos/videos</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="photoVideoRelease"
                        checked={formData.photoVideoRelease === false}
                        onChange={() => setFormData({ ...formData, photoVideoRelease: false })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">No, I do not consent to photos/videos</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Signature <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-gray-600">
                  Please sign below to acknowledge that you have read and agree to the above terms.
                </p>
                <SignaturePad
                  value={formData.signature}
                  onSave={(sig) => setFormData({ ...formData, signature: sig })}
                />
                {errors.signature && (
                  <p className="text-sm text-red-500">{errors.signature}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={createSubmission.isLoading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {createSubmission.isLoading ? "Submitting..." : "Submit Consent Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
