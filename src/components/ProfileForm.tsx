import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Constants from backend
const COUNTRIES = [
  "Bangladesh", "India", "Pakistan", "Nepal", "Sri Lanka", "Malaysia", "Germany",
  "Canada", "Australia", "United Kingdom", "United States", "Turkey", "Italy",
  "Poland", "Sweden", "Finland", "Netherlands", "France", "Saudi Arabia", "UAE",
  "Qatar", "Other"
];

const PHONE_CODES = [
  "+880", "+91", "+92", "+977", "+94", "+60", "+49", "+1", "+61", "+44",
  "+966", "+971", "+974", "+90", "+39", "+48", "+46", "+358", "+31", "+33"
];

const CURRENCIES = ["BDT", "USD", "INR", "EUR", "MYR", "AUD", "CAD", "GBP"];

const EDUCATION_LEVELS = ["SSC", "HSC", "O Levels", "A Levels", "Bachelor's", "Master's", "PhD"];

interface EducationEntry {
  level: string;
  institution: string;
  field: string;
  gpa: string;
  year_completed: string;
}

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    full_name_raw: "",
    father_name_raw: "",
    mother_name_raw: "",
    email: "",
    phone_country_code: "+880",
    phone_number: "",
    nationality: "Bangladesh",
    current_living_country: "Bangladesh",
    preferred_countries: [] as string[],
    budget_min_bdt: 500000,
    budget_max_bdt: 2000000,
    preferred_currency: "BDT",
    preferred_intake: "",
  });

  const [education, setEducation] = useState<EducationEntry[]>([
    { level: "HSC", institution: "", field: "Science", gpa: "", year_completed: "" }
  ]);
  
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (country: string) => {
    setFormData((prev) => {
      const current = prev.preferred_countries;
      if (current.includes(country)) {
        return { ...prev, preferred_countries: current.filter((c) => c !== country) };
      } else {
        return { ...prev, preferred_countries: [...current, country] };
      }
    });
  };

  const addEducation = () => {
    setEducation([...education, { level: "", institution: "", field: "", gpa: "", year_completed: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.preferred_countries.length === 0) {
      alert("Please select at least one preferred country");
      return;
    }
    
    setLoading(true);

    try {
      const submitForm = new FormData();
      submitForm.append("full_name_raw", formData.full_name_raw);
      submitForm.append("father_name_raw", formData.father_name_raw);
      submitForm.append("mother_name_raw", formData.mother_name_raw);
      submitForm.append("email", formData.email);
      submitForm.append("phone_country_code", formData.phone_country_code);
      submitForm.append("phone_number", formData.phone_number);
      submitForm.append("nationality", formData.nationality);
      submitForm.append("current_living_country", formData.current_living_country);
      submitForm.append("preferred_countries", formData.preferred_countries.join(","));
      submitForm.append("budget_min_bdt", formData.budget_min_bdt.toString());
      submitForm.append("budget_max_bdt", formData.budget_max_bdt.toString());
      submitForm.append("preferred_currency", formData.preferred_currency);
      submitForm.append("preferred_intake", formData.preferred_intake);
      
      // Convert education to proper format
      const educationJson = education
        .filter(e => e.level) // Only include if level is filled
        .map(e => ({
          level: e.level,
          institution: e.institution || undefined,
          field: e.field || undefined,
          gpa: e.gpa ? parseFloat(e.gpa) : undefined,
          year_completed: e.year_completed ? parseInt(e.year_completed) : undefined,
        }));
      submitForm.append("education_json", JSON.stringify(educationJson));
      
      if (resume) {
        submitForm.append("resume", resume);
      }

      const finalRes = await axios.post(`${API_URL}/profile/submit`, submitForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (finalRes.data.user_id) {
        localStorage.setItem("goabroad_user_id", finalRes.data.user_id.toString());
        alert(`Profile Submitted Successfully! Your User ID is: ${finalRes.data.user_id}`);
        window.location.href = "/";
      }

    } catch (error: any) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Unknown error occurred";
      alert(`Error submitting profile: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>
      
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            type="text"
            required
            className="mt-1 block w-full p-2 border rounded-md text-black"
            value={formData.full_name_raw}
            onChange={(e) => setFormData({ ...formData, full_name_raw: e.target.value })}
            placeholder="As in passport"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Father's Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.father_name_raw}
              onChange={(e) => setFormData({ ...formData, father_name_raw: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.mother_name_raw}
              onChange={(e) => setFormData({ ...formData, mother_name_raw: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Contact Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            required
            className="mt-1 block w-full p-2 border rounded-md text-black"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country Code</label>
            <select
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.phone_country_code}
              onChange={(e) => setFormData({ ...formData, phone_country_code: e.target.value })}
            >
              {PHONE_CODES.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="1712345678"
            />
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Background</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nationality</label>
            <select
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            >
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currently Living In</label>
            <select
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.current_living_country}
              onChange={(e) => setFormData({ ...formData, current_living_country: e.target.value })}
            >
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-700">Education History</h3>
          <button
            type="button"
            onClick={addEducation}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            + Add Education
          </button>
        </div>
        
        {education.map((edu, index) => (
          <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Entry {index + 1}</span>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Level</label>
                <select
                  className="mt-1 block w-full p-2 border rounded-md text-black text-sm"
                  value={edu.level}
                  onChange={(e) => updateEducation(index, "level", e.target.value)}
                >
                  <option value="">Select</option>
                  {EDUCATION_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Field/Major</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded-md text-black text-sm"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, "field", e.target.value)}
                  placeholder="e.g., Science, CSE"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Institution</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded-md text-black text-sm"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  placeholder="School/College/University"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600">GPA/CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full p-2 border rounded-md text-black text-sm"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                    placeholder="5.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Year</label>
                  <input
                    type="number"
                    className="mt-1 block w-full p-2 border rounded-md text-black text-sm"
                    value={edu.year_completed}
                    onChange={(e) => updateEducation(index, "year_completed", e.target.value)}
                    placeholder="2024"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Study Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Study Preferences</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Countries *</label>
          <div className="grid grid-cols-3 gap-2">
            {COUNTRIES.slice(0, 12).map((country) => (
              <label key={country} className="flex items-center space-x-2 text-black text-sm">
                <input
                  type="checkbox"
                  checked={formData.preferred_countries.includes(country)}
                  onChange={() => handleCountryChange(country)}
                  className="rounded text-blue-600"
                />
                <span>{country}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Budget (BDT)</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.budget_min_bdt}
              onChange={(e) => setFormData({ ...formData, budget_min_bdt: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Budget (BDT)</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.budget_max_bdt}
              onChange={(e) => setFormData({ ...formData, budget_max_bdt: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              className="mt-1 block w-full p-2 border rounded-md text-black"
              value={formData.preferred_currency}
              onChange={(e) => setFormData({ ...formData, preferred_currency: e.target.value })}
            >
              {CURRENCIES.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Intake</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border rounded-md text-black"
            value={formData.preferred_intake}
            onChange={(e) => setFormData({ ...formData, preferred_intake: e.target.value })}
            placeholder="e.g., Fall 2026, Spring 2027"
          />
        </div>
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Resume (Optional)</label>
        <input
          type="file"
          accept="application/pdf"
          className="mt-1 block w-full text-black"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-gray-500 mt-1">Upload your resume (PDF) to help us provide better personalized advice.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
      >
        {loading ? "Submitting..." : "Start Your Journey 🚀"}
      </button>
    </form>
  );
}
