import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GeometricBackground from '@/components/GeometricBackground';
import { User, ArrowLeft, LogOut, Save } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage (mock authentication)
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const userData = JSON.parse(mockUser);
      setUser(userData);
      setEmail(userData.email);
      setFullName(userData.user_metadata?.full_name || '');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Mock profile update
      const updatedUser = {
        ...user,
        user_metadata: { ...user.user_metadata, full_name: fullName }
      };
      
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('mockUser');
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white text-xl">🧠</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/home" 
              className="flex items-center space-x-2 text-gray-700 hover:text-braini-blue transition-colors px-3 py-2 rounded-lg hover:bg-white/50"
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/fa0ca160-fc3a-4e28-b976-371888549499.png" 
                alt="Braini Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-xl font-bold text-braini-blue">Braini</h1>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-braini-blue text-braini-blue hover:bg-braini-blue hover:text-white"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="text-white" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Your <span className="text-braini-blue">Profile</span>
          </h2>
          <p className="text-lg text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Form */}
        <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50 border-2 border-gray-200"
                  />
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>

                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    className={`border-2 transition-colors ${
                      isEditing 
                        ? 'border-gray-200 focus:border-braini-blue' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto bg-braini-blue hover:bg-braini-blue-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-braini-blue hover:bg-braini-blue-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <Save size={18} />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                      </Button>
                      
                      <Button 
                        onClick={() => {
                          setIsEditing(false);
                          setFullName(user.user_metadata?.full_name || '');
                        }}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Card */}
        <div className="max-w-2xl mx-auto mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Account Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Account Created:</strong> Welcome to Braini! 🎉</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
