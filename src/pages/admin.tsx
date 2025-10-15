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
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;

    // Header with colored background
    doc.setFillColor(79, 70, 229); // Indigo color
    doc.rect(0, 0, pageWidth, 35, "F");
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("DAYCARE CONSENT FORM", pageWidth / 2, 15, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Official Parent/Guardian Authorization Document", pageWidth / 2, 25, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPos = 45;

    // Helper function for section headers
    const addSectionHeader = (title: string) => {
      doc.setFillColor(229, 231, 235); // Light gray
      doc.roundedRect(15, yPos - 5, pageWidth - 30, 12, 2, 2, "F");
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text(title, 20, yPos + 2);
      doc.setTextColor(0, 0, 0);
      yPos += 15;
    };

    // Helper function for field labels and values
    const addField = (label: string, value: string, inline: boolean = false) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128); // Gray
      doc.text(label, 20, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      if (inline) {
        doc.text(value, 75, yPos);
        yPos += 7;
      } else {
        yPos += 6;
        const splitText = doc.splitTextToSize(value, pageWidth - 45);
        doc.text(splitText, 25, yPos);
        yPos += 6 * splitText.length + 3;
      }
    };

    // Child Information Section
    addSectionHeader("👶 CHILD INFORMATION");
    addField("Child's Full Name:", selectedData.childFullName, true);
    addField("Date of Birth:", new Date(selectedData.childDateOfBirth).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }), true);
    yPos += 5;

    // Parent/Guardian Information Section
    addSectionHeader("👤 PARENT/GUARDIAN INFORMATION");
    addField("Full Name:", selectedData.parentFullName, true);
    addField("Phone Number:", selectedData.parentPhoneNumber, true);
    addField("Emergency Contact:", selectedData.emergencyContactInfo, true);
    yPos += 5;

    // Medical Information Section
    addSectionHeader("🏥 MEDICAL INFORMATION");
    const allergies = selectedData.allergiesMedicalConditions || "None reported";
    addField("Allergies & Medical Conditions:", allergies, false);
    yPos += 5;

    // Permissions Section
    addSectionHeader("✓ PERMISSIONS & AUTHORIZATIONS");
    
    // Create styled checkboxes
    const addCheckbox = (label: string, checked: boolean) => {
      // Draw checkbox
      if (checked) {
        doc.setFillColor(34, 197, 94); // Green
        doc.roundedRect(20, yPos - 3, 5, 5, 1, 1, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text("✓", 21, yPos + 1);
      } else {
        doc.setDrawColor(220, 38, 38); // Red
        doc.setLineWidth(0.5);
        doc.roundedRect(20, yPos - 3, 5, 5, 1, 1, "S");
      }
      
      // Label
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(label, 30, yPos);
      yPos += 8;
    };

    addCheckbox("Permission to Participate in Activities", selectedData.permissionToParticipate);
    addCheckbox("Emergency Medical Treatment Authorization", selectedData.emergencyMedicalAuth);
    addCheckbox("Photo/Video Release Consent", selectedData.photoVideoRelease);
    yPos += 5;

    // Signature Section
    addSectionHeader("✍️ PARENT/GUARDIAN SIGNATURE");
    
    // Signature box with border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, yPos, 90, 35, 2, 2, "S");
    
    if (selectedData.signature) {
      try {
        doc.addImage(selectedData.signature, "PNG", 22, yPos + 2, 86, 31);
      } catch (error) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(107, 114, 128);
        doc.text("(Signature captured)", 25, yPos + 18);
      }
    }
    
    yPos += 40;
    
    // Date and authentication info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(`Electronically signed on: ${new Date(selectedData.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}`, 20, yPos);
    yPos += 5;
    doc.text(`Document ID: ${selectedData.id}`, 20, yPos);

    // Footer
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.8);
    doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont("helvetica", "italic");
    doc.text("This is an official daycare consent document.", pageWidth / 2, pageHeight - 18, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageWidth / 2, pageHeight - 12, { align: "center" });

    // Save the PDF
    const fileName = `Consent_${selectedData.childFullName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
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
