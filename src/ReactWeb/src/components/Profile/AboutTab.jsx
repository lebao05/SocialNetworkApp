import React, { useState, useEffect } from 'react';
import { GraduationCap, Globe, Home, MapPin, Clock, Edit2, Cake, Heart, Users, Smile, Lock, X, Check, Plus, Trash2 } from 'lucide-react';
import { addSchoolApi, updateSchoolApi, deleteSchoolApi } from '../../apis/schoolApi';

// Helper to match C# Enums to client strings
const SCHOOL_TYPES = {
  0: { label: 'Đại học (University)', supportsDegree: true },
  1: { label: 'Cao đẳng (College)', supportsDegree: true },
  2: { label: 'Trung học phổ thông (High School)', supportsDegree: false },
  3: { label: 'Trung học cơ sở (Secondary School)', supportsDegree: false },
  4: { label: 'Tiểu học (Primary School)', supportsDegree: false },
};

const DEGREE_TYPES = {
  0: 'Bachelor',
  1: 'Master',
  2: 'Doctorate',
  3: 'Other'
};

export default function AboutTab({ theme, schools = [], profileDetails, dateOfBirth, handleEdit, fetchSchools, canEdit = true }) {
  const [activeSubTab, setActiveSubTab] = useState('Personal Information');
  const [editingField, setEditingField] = useState(null);
  
  // Sorted schools list (0 to 4 sorting guarantees University -> Primary order)
  const [sortedSchools, setSortedSchools] = useState([]);
  
  // Single school form state for Add/Edit
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState(null); // null means "Adding New"
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    type: 0,
    degree: null,
    major: '',
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear()
  });

  const [editValues, setEditValues] = useState({
    currentCity: profileDetails?.currentCity || '',
    hometown: profileDetails?.hometown || '',
    birthDate: dateOfBirth || '',
    birthYear: profileDetails?.birthYear || '',
    relationship: profileDetails?.relationship || '',
    family: profileDetails?.family || '',
    gender: profileDetails?.gender || '',
    pronoun: profileDetails?.pronoun || '',
    language: profileDetails?.language || '',
    website: profileDetails?.website || ''
  });

  useEffect(() => {
    setEditValues({
      currentCity: profileDetails?.currentCity || '',
      hometown: profileDetails?.hometown || '',
      birthDate: dateOfBirth || '',
      birthYear: profileDetails?.birthYear || '',
      relationship: profileDetails?.relationship || '',
      family: profileDetails?.family || '',
      gender: profileDetails?.gender || '',
      pronoun: profileDetails?.pronoun || '',
      language: profileDetails?.language || '',
      website: profileDetails?.website || ''
    });
  }, [profileDetails, dateOfBirth]);

  // Prevent edit mode when viewing another user's profile
  useEffect(() => {
    if (!canEdit) {
      setEditingField(null);
      setIsEditingSchool(false);
    }
  }, [canEdit]);

  // Sort schools whenever the schools list updates from backend
  useEffect(() => {
    if (schools && Array.isArray(schools)) {
      const sorted = [...schools].sort((a, b) => a.type - b.type);
      setSortedSchools(sorted);
    }
  }, [schools]);

  const menuItems = [
    { id: 'Personal Information', label: 'Personal Information' },
    { id: 'Education', label: 'Education' },
  ];

  const handleSavePersonal = (field) => {
    setEditingField(null);
    if (!canEdit || !handleEdit) return;
    if (field === 'birthDate') {
      handleEdit('dateOfBirth', editValues.birthDate);
    } else {
      handleEdit(field, editValues[field]);
    }
  };

  const handleCancelPersonal = (field) => {
    setEditingField(null);
    setEditValues({
      ...editValues,
      [field]: profileDetails[field] || ''
    });
  };

  // Education Actions
  const handleOpenAddForm = () => {
    setEditingSchoolId(null);
    setSchoolForm({
      name: '',
      type: 0,
      degree: 0, // Bachelor default for Uni
      major: '',
      startYear: new Date().getFullYear() - 4,
      endYear: new Date().getFullYear()
    });
    setIsEditingSchool(true);
  };

  const handleOpenEditForm = (school) => {
    setEditingSchoolId(school.id);
    setSchoolForm({
      name: school.name || '',
      type: school.type,
      degree: school.degree !== null && school.degree !== undefined ? school.degree : null,
      major: school.major || '',
      startYear: school.startYear,
      endYear: school.endYear
    });
    setIsEditingSchool(true);
  };

  const handleSchoolTypeChange = (typeVal) => {
    const type = parseInt(typeVal, 10);
    const supportsDegree = SCHOOL_TYPES[type].supportsDegree;
    setSchoolForm({
      ...schoolForm,
      type,
      degree: supportsDegree ? 0 : null, // Clear degree validation requirements
      major: supportsDegree ? schoolForm.major : '' // Clear major for lower schools
    });
  };

  const handleSaveSchool = async () => {
    if (!schoolForm.name.trim()) return alert("School name is required.");
    if (schoolForm.startYear > schoolForm.endYear) return alert("Start year cannot be later than end year.");

    try {
      if (editingSchoolId) {
        await updateSchoolApi(editingSchoolId, schoolForm);
      } else {
        await addSchoolApi(schoolForm);
      }
      setIsEditingSchool(false);
      if (fetchSchools) fetchSchools();
    } catch (err) {
      console.error("Failed to save school parameters", err);
    }
  };

  const handleDeleteSchool = async (id) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      try {
        await deleteSchoolApi(id);
        setIsEditingSchool(false);
        if (fetchSchools) fetchSchools();
      } catch (err) {
        console.error("Failed to delete school", err);
      }
    }
  };

  const renderField = (label, value, fieldName, icon, options = null, showActions = true) => {
    const isEditing = editingField === fieldName;
    const hasValue = !!value;
    const editable = showActions && canEdit;

    return (
      <div className="flex items-start justify-between mb-6 group/field">
        <div className="flex gap-3 flex-1">
          <div className={`w-10 h-10 rounded-full ${theme.input} flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-200`}>
            {React.cloneElement(icon, { className: `${theme.textSub} w-5 h-5` })}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex flex-col gap-2 max-w-md">
                <label className={`text-xs font-bold ${theme.textSub}`}>{label}</label>
                {options ? (
                  <select
                    value={editValues[fieldName]}
                    onChange={(e) => setEditValues({ ...editValues, [fieldName]: e.target.value })}
                    className={`w-full rounded-lg p-2 text-sm ${theme.input} outline-none focus:ring-2 focus:ring-blue-500 border ${theme.border} ${theme.text}`}
                    autoFocus
                  >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={fieldName === 'birthDate' ? 'date' : 'text'}
                    value={editValues[fieldName]}
                    onChange={(e) => setEditValues({ ...editValues, [fieldName]: e.target.value })}
                    className={`w-full rounded-lg p-2 text-sm ${theme.input} outline-none focus:ring-2 focus:ring-blue-500 border ${theme.border} ${theme.text}`}
                    autoFocus
                  />
                )}
              </div>
            ) : (
              <div>
                {hasValue ? (
                  <>
                    {fieldName === 'website' ? (
                      <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[15px] leading-snug text-[#1877f2] hover:underline truncate block">
                        {value}
                      </a>
                    ) : (
                      <p className={`font-semibold text-[15px] leading-snug truncate ${theme.text}`}>{value}</p>
                    )}
                    <p className={`text-xs mt-0.5 ${theme.textSub}`}>{label}</p>
                  </>
                ) : (
                  <p className={`text-[15px] font-medium ${theme.textSub} py-1.5 ${canEdit ? 'cursor-pointer hover:text-blue-500' : ''} transition-colors`} onClick={() => canEdit && showActions && setEditingField(fieldName)}>
                    {label}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button onClick={() => handleSavePersonal(fieldName)} className="w-8 h-8 cursor-pointer rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500" title="Save">
                <Check size={16} />
              </button>
              <button onClick={() => handleCancelPersonal(fieldName)} className="w-8 h-8 cursor-pointer rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500" title="Cancel">
                <X size={16} />
              </button>
            </div>
          ) : (
            hasValue && editable && (
              <button onClick={() => setEditingField(fieldName)} className={`w-8 h-8 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 ${theme.btnGray}`} title="Edit">
                <Edit2 size={14} />
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${theme.card} rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 transition-colors duration-200`}>
      {/* Left Side Menu */}
      <div className={`md:w-1/3 flex flex-col gap-1 border-r ${theme.border} pr-4`}>
        <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>About</h3>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            className={`text-left px-3 py-2 text-[14px] font-semibold rounded-lg transition-all ${activeSubTab === item.id ? 'bg-blue-100 dark:bg-blue-900/30 text-[#1877f2]' : `${theme.textSub} ${theme.tabHover}`}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Side Content Pane */}
      <div className="flex-1 flex flex-col gap-6">
        {activeSubTab === 'Personal Information' && (
          <div>
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Location</h4>
            {renderField('Current city', editValues.currentCity, 'currentCity', <Home />)}
            <hr className={`${theme.sidebarHr} mb-4`} />

            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Hometown</h4>
            {renderField('Hometown', editValues.hometown, 'hometown', <MapPin />)}
            <hr className={`${theme.sidebarHr} mb-4`} />

            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Birthday</h4>
            {renderField('Date of birth', profileDetails?.birthDate && profileDetails?.birthYear ? `${profileDetails.birthDate}, ${profileDetails.birthYear}` : (profileDetails?.birthDate || profileDetails?.birthYear || ''), 'birthDate', <Cake />)}
            <hr className={`${theme.sidebarHr} mb-4`} />

            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Status</h4>
            {renderField('Relationship status', editValues.relationship, 'relationship', <Heart />, ['Single', 'In a relationship', 'Engaged', 'Married', 'In an open relationship', 'It\'s complicated', 'Separated', 'Divorced', 'Widowed', 'Not specified'])}
            <hr className={`${theme.sidebarHr} mb-4`} />

            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Gender</h4>
            {renderField('Gender', editValues.gender, 'gender', <Smile />, ['Male', 'Female'])}
            <hr className={`${theme.sidebarHr} mb-4`} />

            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Website</h4>
            {renderField('Website', editValues.website, 'website', <Globe />)}
          </div>
        )}

        {activeSubTab === 'Education' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className={`text-base font-bold ${theme.text}`}>Education history</h4>
              {canEdit && !isEditingSchool && (
                <button 
                  onClick={handleOpenAddForm} 
                  className="flex items-center gap-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs font-bold text-[#1877f2] hover:underline px-3 py-1 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Add school
                </button>
              )}
            </div>

            {/* School Form Component (Forced Pure White Theme Background) */}
            {isEditingSchool && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white shadow-sm text-gray-900">
                <h5 className="text-sm font-bold mb-3 text-gray-900">
                  {editingSchoolId ? "Update school" : "Add new school"}
                </h5>
                <div className="flex flex-col gap-4">
                  {/* School Type Selection */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">Grade level</label>
                    <select
                      value={schoolForm.type}
                      onChange={(e) => handleSchoolTypeChange(e.target.value)}
                      className="w-full rounded-lg p-2 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(SCHOOL_TYPES).map(([val, obj]) => (
                        <option key={val} value={val}>{obj.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* School Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">School name</label>
                    <input
                      type="text"
                      value={schoolForm.name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                      className="w-full rounded-lg p-2 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter school name..."
                    />
                  </div>

                  {/* Degree Selection (Conditional based on University/College) */}
                  {SCHOOL_TYPES[schoolForm.type].supportsDegree && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Degree</label>
                        <select
                          value={schoolForm.degree ?? 0}
                          onChange={(e) => setSchoolForm({ ...schoolForm, degree: parseInt(e.target.value, 10) })}
                          className="w-full rounded-lg p-2 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.entries(DEGREE_TYPES).map(([val, name]) => (
                            <option key={val} value={val}>{name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Chuyên ngành (Major)</label>
                        <input
                          type="text"
                          value={schoolForm.major}
                          onChange={(e) => setSchoolForm({ ...schoolForm, major: e.target.value })}
                          className="w-full rounded-lg p-2 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Software Engineering"
                        />
                      </div>
                    </>
                  )}

                  {/* Years */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Start year</label>
                      <input
                        type="number"
                        value={schoolForm.startYear}
                        onChange={(e) => setSchoolForm({ ...schoolForm, startYear: parseInt(e.target.value, 10) || 0 })}
                        className="w-full rounded-lg p-2 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">End year</label>
                      <input
                        type="number"
                        value={schoolForm.endYear}
                        onChange={(e) => setSchoolForm({ ...schoolForm, endYear: parseInt(e.target.value, 10) || 0 })}
                        className="w-full rounded-lg p-2 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    {editingSchoolId ? (
                      <button 
                        onClick={() => handleDeleteSchool(editingSchoolId)} 
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete school
                      </button>
                    ) : <div />}
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsEditingSchool(false)} 
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button onClick={handleSaveSchool} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#1877f2] text-white hover:bg-blue-600 transition-colors">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sorted Schools Render Pipeline */}
            <div className="flex flex-col gap-4">
              {sortedSchools.length > 0 ? (
                sortedSchools.map((school) => {
                  const isHigherEd = SCHOOL_TYPES[school.type]?.supportsDegree;
                  return (
                    <div key={school.id} className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800 last:border-none">
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full ${theme.input} flex items-center justify-center flex-shrink-0`}>
                          <GraduationCap className={`${theme.textSub} w-6 h-6`} />
                        </div>
                        <div>
                          <p className={`font-semibold ${theme.text}`}>{school.name}</p>
                          <p className={`text-xs font-medium text-blue-500`}>
                            {SCHOOL_TYPES[school.type]?.label || 'School'}
                          </p>
                          {isHigherEd && school.major && (
                            <p className={`text-sm ${theme.text} mt-0.5`}>
                              Major: <span className="font-medium">{school.major}</span>
                              {school.degree !== null && ` (${DEGREE_TYPES[school.degree]})`}
                            </p>
                          )}
                          <p className={`text-xs ${theme.textSub} mt-0.5`}>
                            Duration: {school.startYear} - {school.endYear}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <button 
                            onClick={() => handleOpenEditForm(school)} 
                            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${theme.btnGray}`}
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                !isEditingSchool && (
                  <p className={`text-center py-6 text-sm ${theme.textSub}`}>
                    No education info yet. Add your school.
                  </p>
                )
              )}
            </div>
          </div>
        )}

        {activeSubTab !== 'Personal Information' && activeSubTab !== 'Education' && (
          <div className={`flex items-center justify-center h-full min-h-[200px] ${theme.textSub}`}>
            This section is under development
          </div>
        )}
      </div>
    </div>
  );
}