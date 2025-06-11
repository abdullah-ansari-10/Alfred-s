import React, { useState } from 'react';
import { Camera, QrCode, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export const ProfilePage: React.FC = () => {
  const { user } = useStore();
  const [fullName, setFullName] = useState(user?.name || 'John Doe');
  const [username, setUsername] = useState('johndoe');
  const [email] = useState(user?.email || 'john.doe@example.com');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-500">
            <img
              src={previewImage || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
            <Camera size={16} className="text-white" />
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">{fullName}</h2>
          <p className="text-dark-300">Premium Member</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white opacity-75 cursor-not-allowed"
          />
          <p className="text-xs text-dark-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Share Profile */}
        <div>
          <button className="flex items-center space-x-2 text-primary-500 hover:text-primary-400 transition-colors">
            <QrCode size={20} />
            <span>Share Profile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button className="btn btn-primary">Save Changes</button>
          <button className="btn btn-secondary flex items-center space-x-2">
            <Lock size={16} />
            <span>Change Password</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-secondary flex items-center space-x-2 text-error-500 hover:text-error-400"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};