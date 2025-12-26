import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Stethoscope, Pill, Briefcase, ExternalLink, BookOpen, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { blogPosts, BlogPost } from "@/data/blogs";
import { healthTipsBD, BDTip } from "@/data/healthTipsBD";
import { SearchBar } from "@/components/SearchBar";

interface SearchResult {
  id: string;
  type: 'doctor' | 'medicine' | 'service' | 'blog' | 'health-tip';
  name: string;
  description?: string;
  specialty?: string;
  experience?: number;
  consultationFee?: number;
  verified?: boolean;
  link: string;
  relevance: number;
  category?: string;
}

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Client-side search for blogs
  const searchBlogs = (searchQuery: string): SearchResult[] => {
    const lowerQuery = searchQuery.toLowerCase();
    return blogPosts
      .filter((post: BlogPost) => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.category.toLowerCase().includes(lowerQuery)
      )
      .map((post: BlogPost) => ({
        id: `blog-${post.id}`,
        type: 'blog' as const,
        name: post.title,
        description: post.excerpt,
        category: post.category,
        link: `/blog/${post.slug}`,
        relevance: post.title.toLowerCase().includes(lowerQuery) ? 90 : 70,
      }));
  };

  // Client-side search for health tips
  const searchHealthTips = (searchQuery: string): SearchResult[] => {
    const lowerQuery = searchQuery.toLowerCase();
    return healthTipsBD
      .filter((tip: BDTip) => 
        tip.title.toLowerCase().includes(lowerQuery) ||
        tip.category.toLowerCase().includes(lowerQuery) ||
        tip.items.some(item => 
          item.heading.toLowerCase().includes(lowerQuery) ||
          item.points.some(point => point.toLowerCase().includes(lowerQuery))
        )
      )
      .map((tip: BDTip, index: number) => ({
        id: `health-tip-${index}`,
        type: 'health-tip' as const,
        name: tip.title,
        description: tip.items[0]?.points.slice(0, 2).join('. ') || '',
        category: tip.category,
        link: `/health-tips`,
        relevance: tip.title.toLowerCase().includes(lowerQuery) ? 85 : 65,
      }));
  };

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchData = async () => {
      setLoading(true);
      setError("");
      
      try {
        // Search backend for doctors, medicine, services
        const { data, error: searchError } = await supabase.functions.invoke('search', {
          body: { query, types: ['doctors', 'medicine', 'services'] }
        });

        if (searchError) throw searchError;
        
        // Get backend results
        const backendResults: SearchResult[] = data.results || [];
        
        // Get client-side results for blogs and health tips
        const blogResults = searchBlogs(query);
        const healthTipResults = searchHealthTips(query);
        
        // Combine and sort all results by relevance
        const allResults = [...backendResults, ...blogResults, ...healthTipResults]
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 30); // Limit total results
        
        setResults(allResults);
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.message || 'Failed to perform search');
        
        // Even if backend fails, show client-side results
        const blogResults = searchBlogs(query);
        const healthTipResults = searchHealthTips(query);
        const fallbackResults = [...blogResults, ...healthTipResults]
          .sort((a, b) => b.relevance - a.relevance);
        
        if (fallbackResults.length > 0) {
          setResults(fallbackResults);
          setError(""); // Clear error if we have some results
        }
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'doctor': return <Stethoscope className="h-5 w-5" />;
      case 'medicine': return <Pill className="h-5 w-5" />;
      case 'service': return <Briefcase className="h-5 w-5" />;
      case 'blog': return <BookOpen className="h-5 w-5" />;
      case 'health-tip': return <Lightbulb className="h-5 w-5" />;
      default: return <Search className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'medicine': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'service': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'blog': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'health-tip': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'doctor': return 'Doctor';
      case 'medicine': return 'Medicine';
      case 'service': return 'Service';
      case 'blog': return 'Blog';
      case 'health-tip': return 'Health Tip';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          Showing results for "<span className="font-medium">{query}</span>"
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Searching...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && results.length === 0 && query.length >= 2 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or check your spelling
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          
          {results.map((result) => (
            <Link key={result.id} to={result.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-accent">
                        {getIcon(result.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{result.name}</h3>
                          {result.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        
                        {result.specialty && (
                          <p className="text-sm text-muted-foreground mb-1">
                            {result.specialty}
                          </p>
                        )}

                        {result.category && (
                          <p className="text-sm text-muted-foreground mb-1">
                            {result.category}
                          </p>
                        )}
                        
                        {result.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 mt-3">
                          <Badge className={getTypeColor(result.type)}>
                            {getTypeLabel(result.type)}
                          </Badge>
                          
                          {result.experience && (
                            <span className="text-xs text-muted-foreground">
                              {result.experience} years exp.
                            </span>
                          )}
                          
                          {result.consultationFee && (
                            <span className="text-xs text-muted-foreground">
                              ৳{result.consultationFee}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <Alert>
          <AlertDescription>
            Please enter at least 2 characters to search
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SearchResults;
