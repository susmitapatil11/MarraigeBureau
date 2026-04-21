import React, { useState, useEffect } from "react";
import { Button } from "./Button.jsx";
import { userService } from "../services/index.js";
import { auth } from "../firebase.js";

function Field({ label, type = "text", placeholder, value, onChange, options = null }) {
  if (options) {
    return (
      <label className="stack" style={{ gap: 6 }}>
        <span className="kicker">{label}</span>
        <select className="fmsField" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (type === "textarea") {
    return (
      <label className="stack" style={{ gap: 6 }}>
        <span className="kicker">{label}</span>
        <textarea 
          className="fmsField" 
          placeholder={placeholder} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ resize: 'vertical' }}
        />
      </label>
    );
  }

  return (
    <label className="stack" style={{ gap: 6 }}>
      <span className="kicker">{label}</span>
      <input className="fmsField" type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export default function ProfileEdit({ onSave, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    age: "",
    height: "",
    maritalStatus: "Never Married",
    motherTongue: "",
    location: "",
    religion: "",
    caste: "",
    gotra: "",
    manglik: "No",
    education: "",
    profession: "",
    workingWith: "",
    income: "",
    familyType: "Nuclear",
    familyValues: "Traditional",
    fatherOccupation: "",
    motherOccupation: "",
    familyStatus: "",
    diet: "Vegetarian",
    smoking: "No",
    drinking: "No",
    hobbies: "",
    aboutMe: "",
    partnerPreferences: {
      ageMin: "",
      ageMax: "",
      religion: "Any",
      caste: "",
      education: "Any",
      location: "India",
      lifestyle: "Any",
      income: "Any"
    }
  });

  // Options for dropdowns
  const religionOptions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
  const maritalStatusOptions = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
  const educationOptions = ["High School", "Graduate", "Post Graduate", "Doctorate", "Professional"];
  const workingWithOptions = ["Private Sector", "Government", "Business", "Self Employed", "Not Working"];
  const familyTypeOptions = ["Nuclear", "Joint"];
  const familyValuesOptions = ["Traditional", "Moderate", "Liberal"];
  const dietOptions = ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"];
  const yesNoOptions = ["Yes", "No", "Don't Know"];
  const lifestyleOptions = ["Any", "Family-first", "Traditional", "Balanced", "Modern"];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const result = await userService.getProfile(user.uid);
      if (result.success) {
        setFormData(result.data);
      }
    } catch (error) {
      setError("Failed to load profile");
    }
  };

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        return;
      }

      // Validate required fields
      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.age || 
          !formData.height.trim() || !formData.motherTongue.trim() || 
          !formData.location.trim() || !formData.religion.trim() || 
          !formData.education.trim() || !formData.profession.trim()) {
        setError("Please fill all required fields");
        return;
      }

      // Convert age to number
      const submissionData = {
        ...formData,
        age: parseInt(formData.age),
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h),
        partnerPreferences: {
          ...formData.partnerPreferences,
          ageMin: parseInt(formData.partnerPreferences.ageMin) || 18,
          ageMax: parseInt(formData.partnerPreferences.ageMax) || 100
        }
      };

      const result = await userService.updateProfile(user.uid, submissionData);
      
      if (result.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          if (onSave) onSave();
        }, 1500);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack" style={{ gap: 24 }}>
      {/* Personal Details */}
      <section className="glass p-6" style={{ borderRadius: 18 }}>
        <div className="kicker">Personal Details</div>
        <div className="grid gridCols2" style={{ marginTop: 12, gap: 12 }}>
          <Field label="Full Name" value={formData.fullName} onChange={(value) => updateFormData('fullName', value)} />
          <Field label="Mobile Number" value={formData.phone} onChange={(value) => updateFormData('phone', value)} />
          <Field label="Age" type="number" placeholder="18-100" value={formData.age} onChange={(value) => updateFormData('age', value)} />
          <Field label="Height" placeholder="e.g., 5'5&quot;" value={formData.height} onChange={(value) => updateFormData('height', value)} />
          <Field label="Marital Status" options={maritalStatusOptions} value={formData.maritalStatus} onChange={(value) => updateFormData('maritalStatus', value)} />
          <Field label="Mother Tongue" placeholder="e.g., Hindi" value={formData.motherTongue} onChange={(value) => updateFormData('motherTongue', value)} />
          <Field label="Location" placeholder="City, State" value={formData.location} onChange={(value) => updateFormData('location', value)} />
        </div>
      </section>

      {/* Religious Details */}
      <section className="glass p-6" style={{ borderRadius: 18 }}>
        <div className="kicker">Religious Details</div>
        <div className="grid gridCols2" style={{ marginTop: 12, gap: 12 }}>
          <Field label="Religion" options={religionOptions} value={formData.religion} onChange={(value) => updateFormData('religion', value)} />
          <Field label="Caste" placeholder="Optional" value={formData.caste} onChange={(value) => updateFormData('caste', value)} />
          <Field label="Gotra" placeholder="Optional" value={formData.gotra} onChange={(value) => updateFormData('gotra', value)} />
          <Field label="Manglik" options={yesNoOptions} value={formData.manglik} onChange={(value) => updateFormData('manglik', value)} />
        </div>
      </section>

      {/* Education & Career */}
      <section className="glass p-6" style={{ borderRadius: 18 }}>
        <div className="kicker">Education & Career</div>
        <div className="grid gridCols2" style={{ marginTop: 12, gap: 12 }}>
          <Field label="Education" options={educationOptions} value={formData.education} onChange={(value) => updateFormData('education', value)} />
          <Field label="Profession" placeholder="e.g., Engineer" value={formData.profession} onChange={(value) => updateFormData('profession', value)} />
          <Field label="Working With" options={workingWithOptions} value={formData.workingWith} onChange={(value) => updateFormData('workingWith', value)} />
          <Field label="Income" placeholder="Annual income" value={formData.income} onChange={(value) => updateFormData('income', value)} />
        </div>
      </section>

      {/* Family Details */}
      <section className="glass p-6" style={{ borderRadius: 18 }}>
        <div className="kicker">Family Details</div>
        <div className="grid gridCols2" style={{ marginTop: 12, gap: 12 }}>
          <Field label="Family Type" options={familyTypeOptions} value={formData.familyType} onChange={(value) => updateFormData('familyType', value)} />
          <Field label="Family Values" options={familyValuesOptions} value={formData.familyValues} onChange={(value) => updateFormData('familyValues', value)} />
          <Field label="Father's Occupation" placeholder="e.g., Engineer" value={formData.fatherOccupation} onChange={(value) => updateFormData('fatherOccupation', value)} />
          <Field label="Mother's Occupation" placeholder="e.g., Homemaker" value={formData.motherOccupation} onChange={(value) => updateFormData('motherOccupation', value)} />
          <Field label="Family Status" placeholder="e.g., Middle Class" value={formData.familyStatus} onChange={(value) => updateFormData('familyStatus', value)} />
        </div>
      </section>

      {/* Lifestyle */}
      <section className="glass p-6" style={{ borderRadius: 18 }}>
        <div className="kicker">Lifestyle</div>
        <div className="grid gridCols2" style={{ marginTop: 12, gap: 12 }}>
          <Field label="Diet" options={dietOptions} value={formData.diet} onChange={(value) => updateFormData('diet', value)} />
          <Field label="Smoking" options={yesNoOptions} value={formData.smoking} onChange={(value) => updateFormData('smoking', value)} />
          <Field label="Drinking" options={yesNoOptions} value={formData.drinking} onChange={(value) => updateFormData('drinking', value)} />
          <Field label="Hobbies" placeholder="e.g., Music, Reading, Travel" value={formData.hobbies} onChange={(value) => updateFormData('hobbies', value)} />
        </div>
      </section>

      {/* About Me */}
      <section className="glass p-6" style={{ borderRadius: 18 }}>
        <div className="kicker">About Me</div>
        <div style={{ marginTop: 12 }}>
          <Field 
            type="textarea" 
            label="About Me" 
            placeholder="Tell us about yourself, your interests, what you're looking for..." 
            value={formData.aboutMe} 
            onChange={(value) => updateFormData('aboutMe', value)} 
          />
        </div>
      </section>

      {/* Partner Preferences */}
      <section className="glass p-6" style={{ borderRadius: 18 }}>
        <div className="kicker">Partner Preferences</div>
        <div className="grid gridCols2" style={{ marginTop: 12, gap: 12 }}>
          <Field label="Age Range (Min)" type="number" placeholder="18" value={formData.partnerPreferences.ageMin} onChange={(value) => updateFormData('partnerPreferences.ageMin', value)} />
          <Field label="Age Range (Max)" type="number" placeholder="100" value={formData.partnerPreferences.ageMax} onChange={(value) => updateFormData('partnerPreferences.ageMax', value)} />
          <Field label="Preferred Religion" options={[...religionOptions, "Any"]} value={formData.partnerPreferences.religion} onChange={(value) => updateFormData('partnerPreferences.religion', value)} />
          <Field label="Preferred Education" options={[...educationOptions, "Any"]} value={formData.partnerPreferences.education} onChange={(value) => updateFormData('partnerPreferences.education', value)} />
          <Field label="Preferred Location" placeholder="e.g., India, Mumbai" value={formData.partnerPreferences.location} onChange={(value) => updateFormData('partnerPreferences.location', value)} />
          <Field label="Preferred Lifestyle" options={lifestyleOptions} value={formData.partnerPreferences.lifestyle} onChange={(value) => updateFormData('partnerPreferences.lifestyle', value)} />
        </div>
      </section>

      {/* Error/Success Messages */}
      {error && (
        <div className="muted" style={{ color: "var(--accent-rose)", padding: 12, borderRadius: 8, background: "rgba(232, 160, 191, 0.1)" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="muted" style={{ color: "var(--success)", padding: 12, borderRadius: 8, background: "rgba(46, 204, 113, 0.1)" }}>
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-12" style={{ justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
