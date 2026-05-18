import React, { useState } from 'react';
import { GraduationCap, Globe, Home, MapPin, Clock, Edit2, Cake, Heart, Users, Smile, Lock, X, Check } from 'lucide-react';

export default function AboutTab({ theme, schools, profileDetails, handleEdit }) {
  const [activeSubTab, setActiveSubTab] = useState('Thông tin cá nhân');
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    currentCity: profileDetails.currentCity || '',
    hometown: profileDetails.hometown || '',
    birthYear: profileDetails.birthYear || '',
    gender: 'Nam',
    relationship: 'Độc thân'
  });

  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [isEditingHighSchool, setIsEditingHighSchool] = useState(false);

  const [collegeForm, setCollegeForm] = useState({
    name: 'Trường Đại học Khoa học Tự nhiên, Đại học Quốc gia TP.HCM',
    startYear: '2023',
    endYear: '2027',
    isGraduated: false
  });

  const [highSchoolForm, setHighSchoolForm] = useState({
    name: 'Trường THPT Nguyễn Trãi',
    startYear: '2020',
    endYear: '2023',
    isGraduated: true
  });

  const menuItems = [
    'Giới thiệu',
    'Thông tin cá nhân',
    'Công việc',
    'Trình độ học vấn',
    'Sở thích',
    'Mối quan tâm',
    'Du lịch',
    'Liên kết',
    'Thông tin liên hệ',
    'Tên',
    'Chi tiết về bạn'
  ];

  const handleSave = (field) => {
    console.log(`Saving ${field}:`, editValues[field]);
    setEditingField(null);
    if (handleEdit) {
      handleEdit(field, editValues[field]);
    }
  };

  const handleCancel = (field) => {
    setEditingField(null);
    // Reset to original value if needed
    setEditValues({
      ...editValues,
      [field]: profileDetails[field] || editValues[field]
    });
  };

  const renderField = (label, value, fieldName, icon, options = null) => {
    const isEditing = editingField === fieldName;

    return (
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3a3b3c] flex items-center justify-center flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold ${theme.textSub}`}>{label}</label>
                {options ? (
                  <select
                    value={editValues[fieldName]}
                    onChange={(e) => setEditValues({ ...editValues, [fieldName]: e.target.value })}
                    className={`w-full rounded-lg p-2 text-sm ${theme.input} outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                  >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editValues[fieldName]}
                    onChange={(e) => setEditValues({ ...editValues, [fieldName]: e.target.value })}
                    className={`w-full rounded-lg p-2 text-sm ${theme.input} outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                  />
                )}
              </div>
            ) : (
              <div>
                <p className={`font-semibold ${theme.text}`}>{value || 'Chưa có thông tin'}</p>
                <p className={theme.textSub}>{label}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={() => handleSave(fieldName)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-500`}
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => handleCancel(fieldName)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-500`}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <Globe size={16} className="text-gray-500" />
              <button
                onClick={() => setEditingField(fieldName)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${theme.btnGray}`}
              >
                <Edit2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${theme.card} rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 transition-colors duration-200`}>
      {/* Left Side Menu */}
      <div className="md:w-1/3 flex flex-col gap-1 border-r border-gray-200 dark:border-[#3e4042] pr-4">
        <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Giới thiệu</h3>
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveSubTab(item)}
            className={`text-left px-3 py-2 text-[14px] font-semibold rounded-lg transition-all ${activeSubTab === item ? 'bg-blue-100 dark:bg-blue-900/30 text-[#1877f2]' : theme.textSub + ' dark:hover:bg-[#3a3b3c] hover:bg-gray-100'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right Side Content Pane */}
      <div className="flex-1 flex flex-col gap-6">
        {activeSubTab === 'Thông tin cá nhân' && (
          <div>
            {/* Vị trí */}
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Vị trí</h4>
            {renderField('Tỉnh/Thành phố hiện tại', editValues.currentCity, 'currentCity', <Home className="text-gray-500 w-6 h-6" />)}

            <hr className={`${theme.sidebarHr} mb-4`} />

            {/* Quê quán */}
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Quê quán</h4>
            {renderField('Quê quán', editValues.hometown, 'hometown', <MapPin className="text-gray-500 w-6 h-6" />)}

            <hr className={`${theme.sidebarHr} mb-4`} />

            {/* Sinh nhật */}
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Sinh nhật</h4>
            {renderField('Năm sinh', editValues.birthYear, 'birthYear', <Cake className="text-gray-500 w-6 h-6" />)}

            <hr className={`${theme.sidebarHr} mb-4`} />

            {/* Trạng thái */}
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Trạng thái</h4>
            {renderField('Tình trạng mối quan hệ', editValues.relationship, 'relationship', <Heart className="text-gray-500 w-6 h-6" />, ['Độc thân', 'Đang hẹn hò', 'Đã đính hôn', 'Đã kết hôn', 'Trong một mối quan hệ mở', 'Phức tạp', 'Đã ly thân', 'Đã ly hôn', 'Góa'])}

            <hr className={`${theme.sidebarHr} mb-4`} />

            {/* Giới tính */}
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Giới tính</h4>
            {renderField('Giới tính', editValues.gender, 'gender', <Smile className="text-gray-500 w-6 h-6" />, ['Nam', 'Nữ'])}
          </div>
        )}

        {activeSubTab === 'Trình độ học vấn' && (
          <div>
            {/* Đại học */}
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Đại học</h4>

            {isEditingCollege ? (
              <div className={`border rounded-lg p-4 mb-6 ${theme.border} bg-gray-50 dark:bg-[#242526]`}>
                <div className="flex justify-between items-center mb-4">
                  <button className={`px-3 py-1.5 text-sm font-semibold rounded-lg ${theme.btnGray} flex items-center gap-1`}>
                    <Globe size={14} /> Công khai
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={`text-xs font-bold ${theme.textSub}`}>Tên trường cao đẳng/đại học</label>
                    <input
                      type="text"
                      value={collegeForm.name}
                      onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                      className={`w-full rounded-lg p-2 text-sm ${theme.input} outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Bắt buộc</p>
                  </div>

                  {/* Additional fields from screenshot can be added here if needed */}

                  <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-[#3e4042]">
                    <button className={`px-4 py-2 text-sm font-semibold rounded-lg ${theme.btnGray} text-red-500`}>
                      Gỡ
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingCollege(false)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${theme.btnGray}`}>
                        Hủy
                      </button>
                      <button onClick={() => setIsEditingCollege(false)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#1877f2] text-white">
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1592288331572-88206d226061?w=100&q=80" className="w-8 h-8 object-contain" alt="Logo" />
                  </div>
                  <div>
                    <p className={`font-semibold ${theme.text}`}>{collegeForm.name}</p>
                    <p className={theme.textSub}>Trong {collegeForm.startYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-500" />
                  <button onClick={() => setIsEditingCollege(true)} className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${theme.btnGray}`}>
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className={`flex items-center gap-3 mb-6 ${theme.textSub} cursor-pointer hover:underline`}>
              <GraduationCap size={20} />
              <span>Trường cao đẳng/đại học</span>
            </div>

            <hr className={`${theme.sidebarHr} mb-4`} />

            {/* Trường trung học */}
            <h4 className={`text-base font-bold mb-4 ${theme.text}`}>Trường trung học</h4>

            {isEditingHighSchool ? (
              <div className={`border rounded-lg p-4 mb-6 ${theme.border} bg-gray-50 dark:bg-[#242526]`}>
                <div className="flex justify-between items-center mb-4">
                  <button className={`px-3 py-1.5 text-sm font-semibold rounded-lg ${theme.btnGray} flex items-center gap-1`}>
                    <Globe size={14} /> Công khai
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={`text-xs font-bold ${theme.textSub}`}>Trường học</label>
                    <input
                      type="text"
                      value={highSchoolForm.name}
                      onChange={(e) => setHighSchoolForm({ ...highSchoolForm, name: e.target.value })}
                      className={`w-full rounded-lg p-2 text-sm ${theme.input} outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Bắt buộc</p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-[#3e4042]">
                    <button className={`px-4 py-2 text-sm font-semibold rounded-lg ${theme.btnGray} text-red-500`}>
                      Gỡ
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingHighSchool(false)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${theme.btnGray}`}>
                        Hủy
                      </button>
                      <button onClick={() => setIsEditingHighSchool(false)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#1877f2] text-white">
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3a3b3c] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-gray-500 w-6 h-6" />
                  </div>
                  <div>
                    <p className={`font-semibold ${theme.text}`}>{highSchoolForm.name}</p>
                    <p className={theme.textSub}>Học sinh</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-500" />
                  <button onClick={() => setIsEditingHighSchool(true)} className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${theme.btnGray}`}>
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className={`flex items-center gap-3 ${theme.textSub} cursor-pointer hover:underline`}>
              <Home size={20} />
              <span>Trường trung học phổ thông</span>
            </div>
          </div>
        )}

        {activeSubTab !== 'Thông tin cá nhân' && activeSubTab !== 'Trình độ học vấn' && (
          <div className={`flex items-center justify-center h-full ${theme.textSub}`}>
            Phần này đang được phát triển
          </div>
        )}
      </div>
    </div>
  );
}
