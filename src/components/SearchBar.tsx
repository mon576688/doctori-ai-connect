import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Stethoscope, Pill, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // For now, navigate to chat with the search query
      navigate(`/chat?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const quickSearchOptions = [
    {
      icon: Stethoscope,
      label: "Find Doctors",
      action: () => navigate('/doctors')
    },
    {
      icon: Pill,
      label: "Search Medicine",
      action: () => navigate('/medicine')
    },
    {
      icon: Users,
      label: "AI Health Chat",
      action: () => navigate('/chat')
    },
    {
      icon: BookOpen,
      label: "Health Blog",
      action: () => navigate('/blog')
    }
  ];

  return (
    <div className="w-full bg-background border-b border-border/50">
      <div className="container py-3">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Main Search Bar */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for doctors, symptoms, medicine, health topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="h-12 px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Quick Access Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {quickSearchOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={option.action}
                className="flex items-center space-x-2 bg-white/70 hover:bg-white transition-colors"
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};