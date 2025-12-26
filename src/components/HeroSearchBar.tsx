import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Stethoscope, BookOpen, Pill, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const quickSearchTags = [
  { label: "Doctors", icon: Stethoscope, query: "doctor" },
  { label: "Health Tips", icon: Lightbulb, query: "health tips" },
  { label: "Blogs", icon: BookOpen, query: "health blog" },
  { label: "Medicine", icon: Pill, query: "medicine" },
];

export const HeroSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search doctors, blogs, health tips, medicine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-24 py-6 text-lg rounded-full border-2 border-primary/20 bg-background/95 backdrop-blur-sm shadow-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button
            type="submit"
            variant="medical"
            className="absolute right-2 rounded-full px-6"
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Quick search:</span>
        {quickSearchTags.map((tag) => (
          <Badge
            key={tag.label}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5 text-sm"
            onClick={() => handleQuickSearch(tag.query)}
          >
            <tag.icon className="h-3.5 w-3.5 mr-1.5" />
            {tag.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};
