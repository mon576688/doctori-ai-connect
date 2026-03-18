import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { symptoms, getSymptomCategories } from '@/data/symptoms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

const SymptomsIndex = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = getSymptomCategories();

  const filtered = symptoms.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Common Symptoms A-Z: Causes, Remedies & When to See a Doctor"
        description="Browse 20 common symptoms with causes, home remedies, and medical guidance. Find information about headaches, fever, cough, back pain, and more."
        canonicalPath="/symptoms"
        keywords="symptoms, health symptoms, symptom checker, medical symptoms, causes of symptoms"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Symptoms A-Z</h1>
      <p className="text-muted-foreground mb-6">Browse common symptoms, learn about causes, home remedies, and when to see a doctor.</p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search symptoms..."
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
        {filtered.map(s => (
          <Link key={s.slug} to={`/symptoms/${s.slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <h2 className="font-semibold text-foreground mb-1">{s.name}</h2>
                <p className="text-xs text-primary mb-2">{s.category} • {s.specialtyRecommendation}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{s.metaDescription}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No symptoms found matching your search.</p>
      )}
    </div>
  );
};

export default SymptomsIndex;
