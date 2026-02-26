import SearchResults from "@/components/SearchResults";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";

export default function Search() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title={PAGE_SEO.search.title} description={PAGE_SEO.search.description} canonicalPath={PAGE_SEO.search.canonicalPath} />
      <SearchResults />
    </div>
  );
}
