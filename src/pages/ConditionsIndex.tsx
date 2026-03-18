import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { conditions, getConditionCategories } from '@/data/conditions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

const ConditionsIndex = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = getConditionCategories();

  const filtered = conditions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Health Conditions & Diseases A-Z: Symptoms & Treatment"
        description="Browse 20 common health conditions with symptoms, causes, treatments, and prevention. From diabetes to depression, get reliable medical information."
        canonicalPath="/conditions"
        keywords="health conditions, diseases, medical conditions, disease symptoms, disease treatment"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Conditions & Diseases A-Z</h1>
      <p className="text-muted-foreground mb-6">Browse common health conditions with symptoms, causes, treatments, and prevention strategies.</p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conditions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button variant={!activeCategory ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory(null)}>All</Button>
        {categories.map(cat => (
          <Button key={cat} variant={activeCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory(cat)}>{cat}</Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <Link key={c.slug} to={`/conditions/${c.slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <h2 className="font-semibold text-foreground mb-1">{c.name}</h2>
                <p className="text-xs text-primary mb-2">{c.category}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.metaDescription}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No conditions found matching your search.</p>
      )}
    </div>
  );
};

export default ConditionsIndex;
