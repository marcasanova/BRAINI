import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GeometricBackground from '@/components/GeometricBackground';
import { User, MessageSquare, LogOut, Target, MapPin, Star } from 'lucide-react';

const Home = () => {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('mockUser');
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      // Force page reload to trigger redirect
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/fa0ca160-fc3a-4e28-b976-371888549499.png" 
              alt="Braini Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold text-braini-blue">Braini</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 text-gray-700 hover:text-braini-blue transition-colors px-3 py-2 rounded-lg hover:bg-white/50"
            >
              <User size={18} />
              <span className="hidden md:inline">Profile</span>
            </Link>
            
            <Link 
              to="/chatbot" 
              className="flex items-center space-x-2 text-gray-700 hover:text-braini-blue transition-colors px-3 py-2 rounded-lg hover:bg-white/50"
            >
              <MessageSquare size={18} />
              <span className="hidden md:inline">Chatbot</span>
            </Link>
            
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to your <span className="text-braini-blue">Journey</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mind and emotions in harmony. Explore your goals and track your progress.
          </p>
        </div>

        {/* Goal Map Section */}
        <div className="max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your Goal Map</h3>
                <p className="text-gray-600">Track your emotional wellness journey</p>
              </div>

              {/* Mock Map Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {/* Goal Nodes */}
                {[
                  { title: "Daily Mindfulness", status: "completed", color: "bg-green-100 border-green-300" },
                  { title: "Stress Management", status: "active", color: "bg-braini-blue/20 border-braini-blue" },
                  { title: "Emotional Awareness", status: "pending", color: "bg-gray-100 border-gray-300" },
                  { title: "Self-Reflection", status: "pending", color: "bg-gray-100 border-gray-300" },
                  { title: "Goal Setting", status: "active", color: "bg-braini-pink/20 border-braini-pink" },
                  { title: "Positive Habits", status: "pending", color: "bg-gray-100 border-gray-300" },
                  { title: "Social Connection", status: "pending", color: "bg-gray-100 border-gray-300" },
                  { title: "Life Balance", status: "locked", color: "bg-gray-50 border-gray-200" },
                ].map((goal, index) => (
                  <Card 
                    key={index}
                    className={`${goal.color} border-2 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mb-3">
                        {goal.status === "completed" && <Star className="w-8 h-8 mx-auto text-green-600 fill-current" />}
                        {goal.status === "active" && <Target className="w-8 h-8 mx-auto text-braini-blue" />}
                        {goal.status === "pending" && <MapPin className="w-8 h-8 mx-auto text-gray-500" />}
                        {goal.status === "locked" && <div className="w-8 h-8 mx-auto bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">🔒</div>}
                      </div>
                      <h4 className="font-medium text-sm text-gray-800 mb-1">{goal.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.status === "completed" ? "bg-green-200 text-green-800" :
                        goal.status === "active" ? "bg-blue-200 text-blue-800" :
                        goal.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {goal.status === "completed" ? "Completed" :
                         goal.status === "active" ? "In Progress" :
                         goal.status === "pending" ? "Available" :
                         "Locked"}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map Legend */}
              <div className="flex justify-center mt-8 space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-green-600 fill-current" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-braini-blue" />
                  <span>Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">🔒</div>
                  <span>Locked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Personalize Profile</h3>
                <p className="text-gray-600 text-sm mb-4">Update your preferences and track your progress</p>
                <Link to="/profile">
                  <Button className="bg-braini-blue hover:bg-braini-blue-dark text-white">
                    Go to Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-braini-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Assistant</h3>
                <p className="text-gray-600 text-sm mb-4">Get personalized guidance and support</p>
                <Link to="/chatbot">
                  <Button className="bg-braini-pink hover:bg-braini-pink/80 text-white">
                    Start Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
