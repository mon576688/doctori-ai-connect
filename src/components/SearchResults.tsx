import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface ResultItem {
  type: "Doctor" | "Blog" | "Medicine";
  name: string;
  link: string;
}

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState<ResultItem[]>([]);

  useEffect(() => {
    if (!query) return;

    // Mock data, replace with API calls later
    const mockResults: ResultItem[] = [
      { type: "Doctor" as const, name: "Dr. John Doe", link: "/doctor/1" },
      { type: "Blog" as const, name: "10 Health Tips", link: "/blog/health-tips-bd" },
      { type: "Medicine" as const, name: "Paracetamol", link: "/medicine" },
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

    setResults(mockResults);
  }, [query]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((item, index) => (
            <li
              key={index}
              className="border p-3 rounded hover:shadow-md transition-shadow"
            >
              <span className="font-semibold">{item.type}:</span>{" "}
              <Link to={item.link} className="text-primary hover:underline">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
