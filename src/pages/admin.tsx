import { useState } from "react";
import Head from "next/head";
import { api } from "~/utils/api";
import { jsPDF } from "jspdf";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  const { data: submissions, isLoading } = api.submission.getAll.useQuery(
    undefined,
    { enabled: authenticated }
  );

  const { data: selectedData } = api.submission.getById.useQuery(
    { id: selectedSubmission! },
    { enabled: !!selectedSubmission }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this should be done server-side
    // For simplicity, we're checking against an environment variable
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin123") {
      setAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const downloadPDF = () => {
    if (!selectedData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Daycare Consent Form", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Child Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Child Information", 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Child's Full Name: ${selectedData.childFullName}`, 20, yPos);
    yPos += 7;
    doc.text(`Date of Birth: ${new Date(selectedData.childDateOfBirth).toLocaleDateString()}`, 20, yPos);
    yPos += 12;

    // Parent/Guardian Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Parent/Guardian Information", 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Parent's Full Name: ${selectedData.parentFullName}`, 20, yPos);
    yPos += 7;
    doc.text(`Phone Number: ${selectedData.parentPhoneNumber}`, 20, yPos);
    yPos += 7;
    doc.text(`Emergency Contact: ${selectedData.emergencyContactInfo}`, 20, yPos);
    yPos += 12;

    // Medical Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Medical Information", 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const allergies = selectedData.allergiesMedicalConditions || "None";
    const splitAllergies = doc.splitTextToSize(`Allergies/Medical Conditions: ${allergies}`, pageWidth - 40);
    doc.text(splitAllergies, 20, yPos);
    yPos += 7 * splitAllergies.length + 5;

    // Permissions
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Permissions & Authorizations", 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Permission to Participate: ${selectedData.permissionToParticipate ? "Yes" : "No"}`, 20, yPos);
    yPos += 7;
    doc.text(`Emergency Medical Authorization: ${selectedData.emergencyMedicalAuth ? "Yes" : "No"}`, 20, yPos);
    yPos += 7;
    doc.text(`Photo/Video Release: ${selectedData.photoVideoRelease ? "Yes" : "No"}`, 20, yPos);
    yPos += 12;

    // Signature
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Signature", 20, yPos);
    yPos += 8;

    // Add signature image
    if (selectedData.signature) {
      try {
        doc.addImage(selectedData.signature, "PNG", 20, yPos, 80, 30);
        yPos += 35;
      } catch (error) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.text("(Signature image included)", 20, yPos);
        yPos += 10;
      }
    }

    // Submission date
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Submitted: ${new Date(selectedData.createdAt).toLocaleString()}`, 20, yPos);

    // Save the PDF
    const fileName = `consent_${selectedData.childFullName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <Head>
          <title>Admin Login - Daycare Consent Form</title>
        </Head>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Default password: admin123 (change in production)
          </p>
        </div>
      </div>
    );
  }

  if (selectedData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Submission Details - Admin</title>
        </Head>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                Submission Details
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  ← Back to List
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Child's Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{selectedData.childFullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Date of Birth</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(selectedData.childDateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Parent's Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{selectedData.parentFullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Phone Number</h3>
                  <p className="mt-1 text-lg text-gray-900">{selectedData.parentPhoneNumber}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Emergency Contact</h3>
                  <p className="mt-1 text-lg text-gray-900">{selectedData.emergencyContactInfo}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Allergies/Medical Conditions</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {selectedData.allergiesMedicalConditions || "None"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Permissions</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-4 h-4 rounded ${selectedData.permissionToParticipate ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-900">Permission to Participate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-4 h-4 rounded ${selectedData.emergencyMedicalAuth ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-900">Emergency Medical Authorization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-4 h-4 rounded ${selectedData.photoVideoRelease ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-900">Photo/Video Release</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Signature</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <img src={selectedData.signature} alt="Parent signature" className="max-w-full h-auto" />
                </div>
              </div>

              <div className="border-t pt-6 text-sm text-gray-500">
                <p>Submitted: {new Date(selectedData.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Admin Dashboard - Daycare Consent Forms</title>
      </Head>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              Consent Form Submissions
            </h1>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Logout
            </button>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading submissions...</p>
              </div>
            ) : !submissions || submissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No submissions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Child's Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent's Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.childFullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.parentFullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.parentPhoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedSubmission(submission.id)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
