import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) return;

    // TODO: Replace this with actual API calls to fetch doctors, blogs, etc.
    // Example mock:
    const mockResults = [
      { type: "Doctor", name: "Dr. John Doe" },
      { type: "Blog", name: "10 Health Tips" },
      { type: "Medicine", name: "Paracetamol" },
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

    setResults(mockResults);
  }, [query]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((item, index) => (
            <li key={index} className="border p-3 rounded">
              <span className="font-semibold">{item.type}:</span> {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
