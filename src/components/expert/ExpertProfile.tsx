import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExpertProfile, Education, AvailabilitySlot } from '../../services/expertService';
import expertService from '../../services/expertService';
import { logout } from '../../utils/auth';

// Define the form data interface by extending ExpertProfile
interface ProfileFormData extends Omit<ExpertProfile, '_id' | 'user' | 'createdAt' | 'updatedAt' | 'certifications' | 'rating' | 'reviews'> {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  availability: AvailabilitySlot[];
}

type SocialLinkPlatform = 'website' | 'linkedin' | 'twitter' | 'github' | 'portfolio' | 'other';

interface SocialLinkInput {
  platform: SocialLinkPlatform;
  url: string;
  displayText: string;
}

const ExpertProfile: React.FC = () => {
  const navigate = useNavigate();
  
  // Initialize state with proper types
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form data with all required fields
  const [formData, setFormData] = useState<ProfileFormData>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    hourlyRate: 0,
    isAvailable: true,
    photo: '',
    specialties: [],
    education: [],
    languages: [],
    socialLinks: [],
    availability: []
  });
  
  // Keep profileData in sync with formData when not editing
  const [profileData, setProfileData] = useState<ProfileFormData>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    hourlyRate: 0,
    specialties: [],
    education: [],
    languages: [],
    socialLinks: [],
    photo: '',
    isAvailable: true,
    availability: []
  });
  
  const [newSocialLink, setNewSocialLink] = useState<SocialLinkInput>({
    platform: 'website',
    url: '',
    displayText: ''
  });
  
  const [newEducation, setNewEducation] = useState<Omit<Education, '_id'>>({
    institution: '',
    degree: '',
    field: '',
    year: new Date().getFullYear()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field: 'specialties' | 'languages', value: string, e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return;
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
      // Clear the input field
      if (e && 'target' in e && e.target) {
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const removeArrayItem = (field: 'specialties' | 'languages', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSocialLink(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new social link
  const addSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSocialLink.url) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [
          ...(prev.socialLinks || []), 
          {
            platform: newSocialLink.platform,
            url: newSocialLink.url,
            displayText: newSocialLink.displayText || newSocialLink.platform
          }
        ]
      }));
      setNewSocialLink({ platform: 'website', url: '', displayText: '' });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const addEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEducation.institution && newEducation.degree) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { 
          ...newEducation, 
          _id: Date.now().toString()
        }]
      }));
      setNewEducation({ institution: '', degree: '', field: '', year: new Date().getFullYear() });
    }
  };

  const removeEducation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu._id !== id)
    }));
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
      };
      return { ...prev, education: updatedEducation };
    });
  };

  const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
    }));
  };

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      const profileUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        bio: formData.bio,
        hourlyRate: formData.hourlyRate,
        specialties: formData.specialties,
        education: formData.education,
        languages: formData.languages,
        socialLinks: formData.socialLinks,
        photo: formData.photo,
        isAvailable: formData.isAvailable,
        availability: formData.availability
      };

      let updatedProfile: ExpertProfile;
      
      if (formData._id) {
        const { _id, ...updateData } = formData;
        updatedProfile = await expertService.updateProfile(updateData);
      } else {
        updatedProfile = await expertService.saveProfile(profileUpdate);
      }

      const newProfileData: ProfileFormData = {
        ...formData,
        ...updatedProfile,
        _id: updatedProfile._id,
        firstName: updatedProfile.firstName || formData.firstName,
        lastName: updatedProfile.lastName || formData.lastName,
        photo: updatedProfile.photo || formData.photo,
        availability: updatedProfile.availability || []
      };
      
      setProfileData(newProfileData);
      setFormData(newProfileData);
      setHasProfile(true);
      setIsEditing(false);
      
      alert('Profile saved successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.message || 'Failed to save profile. Please try again.');
      
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsSaving(false);
    }
  }, [formData, navigate]);

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await expertService.uploadPhoto(file);
      
      setFormData(prev => ({
        ...prev,
        photo: response.photoUrl
      }));
      
      setProfileData(prev => ({
        ...prev,
        photo: response.photoUrl
      }));
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setIsLoading(false);
      if (e.target) {
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await expertService.getMyProfile();
        
        if (!data) {
          throw new Error('No profile data received');
        }

        const profileData: ProfileFormData = {
          _id: data._id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: typeof data.user === 'object' ? data.user.email : '',
          phone: data.phone || '',
          title: data.title || '',
          bio: data.bio || '',
          hourlyRate: data.hourlyRate || 0,
          specialties: data.specialties || [],
          education: data.education || [],
          languages: data.languages || [],
          socialLinks: data.socialLinks || [],
          photo: data.photo || '',
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
          availability: data.availability || [],
        };

        setProfileData(profileData);
        setFormData(profileData);
        setHasProfile(true);
      } catch (error: any) {
        console.error('Error in fetchProfile:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        
        let errorMessage = 'Failed to load profile. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Show error message if any
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:underline"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show create profile form if no profile exists
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to QnnectPro!</h1>
            <p className="mt-2 text-gray-600">You don't have an expert profile yet. Let's create one to get started.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                {formData.photo ? (
                  <img src={formData.photo} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.67 0 8.618 3.156 9.856 7.4.064.3.14.593.14.593z" />
                    <circle cx="12" cy="6" r="6" />
                  </svg>
                )}
              </div>
              <label className="cursor-pointer mt-2">
                <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {formData.photo ? 'Change photo' : 'Upload photo'}
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Professional Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Tell us about yourself and your expertise..."
                required
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                Hourly Rate ($)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  min="0"
                  step="5"
                  value={formData.hourlyRate || ''}
                  onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
                Areas of Expertise
              </label>
              <div className="mt-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.specialties.map((specialty, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('specialties', specialty)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  id="specialties"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Add a specialty and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        handleArrayChange('specialties', value, e as any);
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Home
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Creating...' : 'Create Expert Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Expert Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your professional information and availability
            </p>
          </div>
          {!isEditing && (
            <div className="flex space-x-3">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${profileData?.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-500">
                  {profileData?.isAvailable ? 'Available for consultations' : 'Not available'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="space-y-6 px-4 py-5 sm:p-6">
              {/* Profile Photo Upload */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Profile Photo
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                      {formData.photo ? (
                        <img src={formData.photo} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                      Change
                      <input type="file" className="sr-only" onChange={handlePhotoUpload} accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  First Name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Last Name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Professional Title
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Bio
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400"
                  />
                  <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself and your expertise.</p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Hourly Rate ($)
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      name="hourlyRate"
                      id="hourlyRate"
                      min="0"
                      step="1"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Specialties
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="flex">
                    <input
                      type="text"
                      name="specialty"
                      id="specialty"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            handleArrayChange('specialties', input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Add a specialty and press Enter"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.specialties.map((specialty, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('specialties', specialty)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                        >
                          <span className="sr-only">Remove {specialty}</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                  {profileData.photo ? (
                    <img src={profileData.photo} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">{`${profileData.firstName} ${profileData.lastName}`.trim()}</h3>
                  <p className="text-lg text-indigo-600">{profileData.title}</p>
                  <div className="mt-2 flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${profileData.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {profileData.isAvailable ? 'Available for consultations' : 'Not available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{`${profileData.firstName} ${profileData.lastName}`.trim()}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.title}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">{profileData.bio}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${profileData.hourlyRate}/hour</dd>
              </div>

              {profileData.specialties.length > 0 && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Specialties</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {profileData.specialties.map((s, i) => <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{s}</span>)}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertProfile; 