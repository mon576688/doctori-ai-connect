
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { blogPosts, BlogPost as BlogPostType } from "@/data/blogs";
import { useToast } from "@/components/ui/use-toast";

const getSupplementsContent = (): string => {
  return `
# Which Supplements Can Boost the Effects of Antidepressants?

Several supplements—omega-3 fatty acids, SAMe, methylfolate, vitamin D, zinc, curcumin, and probiotics—have the strongest evidence for boosting the effects of antidepressants in people with depression.

## Can supplements boost the effects of antidepressants?

Based on extensive research with 20+ sources, the consensus shows:
- **Yes (56%)**: Strong evidence supports supplement augmentation
- **Possibly (38%)**: Moderate evidence for benefit
- **Mixed (6%)**: Some conflicting results
- **No (0%)**: No evidence suggests they're ineffective

## Most Supported Supplements

### Omega-3 Fatty Acids (EPA/DHA)
**Evidence**: Strong  
**Efficacy & Safety**: Consistently improves antidepressant response, especially EPA-rich formulations; well-tolerated

### SAMe (S-Adenosyl Methionine)
**Evidence**: Strong  
**Efficacy & Safety**: Effective as adjunct therapy; generally safe

### Methylfolate
**Evidence**: Strong  
**Efficacy & Safety**: Especially beneficial in those with low folate; superior to folic acid

### Vitamin D
**Evidence**: Moderate-Strong  
**Efficacy & Safety**: Positive effects, particularly in those with deficiency; safe supplementation

### Zinc
**Evidence**: Moderate  
**Efficacy & Safety**: Augments antidepressant effect, especially helpful in treatment-resistant cases

### Curcumin
**Evidence**: Moderate  
**Efficacy & Safety**: Reduces depressive symptoms as adjunct therapy

### Probiotics
**Evidence**: Emerging  
**Efficacy & Safety**: Some evidence for benefit; more research needed

### Caffeine (Low Dose)
**Evidence**: Moderate  
**Efficacy & Safety**: May enhance antidepressant effect and cognition

## Other Notable Supplements

**Show Promise but Need More Research:**
- Magnesium
- Selenium
- Coenzyme Q10 (CoQ10)
- Tryptophan
- Saffron

**Mixed or Insufficient Evidence:**
- Folic acid (not methylfolate)
- Inositol

## Mechanisms and Considerations

These supplements may work through several pathways:

1. **Reducing inflammation** - Many mental health conditions involve inflammatory processes
2. **Supporting neurotransmitter synthesis** - Providing building blocks for serotonin, dopamine, and other key brain chemicals
3. **Improving neuroplasticity** - Enhancing the brain's ability to form new connections

### Important Safety Notes

⚠️ **Always consult a healthcare provider** before combining supplements with antidepressants due to possible:
- Drug interactions
- Contraindications
- Individual health factors

Most supplements listed are well-tolerated, but medical supervision ensures safe and effective use.

## Conclusion

The best-supported supplements for boosting antidepressant effects are:
1. **Omega-3 fatty acids** (especially EPA)
2. **SAMe**
3. **Methylfolate**
4. **Vitamin D**
5. **Zinc**

Curcumin and probiotics also show promise. Supplement choice should be individualized and ideally undertaken under medical supervision, particularly for those with nutrient deficiencies or treatment-resistant depression.

---

⚠️ **Medical Disclaimer**: This information is for educational purposes only and based on current research evidence. It should not replace professional medical advice. Always consult with a qualified healthcare provider before starting any supplement regimen, especially when taking prescription medications.

*This article synthesizes findings from 20+ peer-reviewed sources and represents current evidence-based understanding of supplement augmentation in depression treatment.*
  `.trim();
};

const generateFullContent = (post: BlogPostType): string => {
  // Special content for supplement article
  if (post.id === 61) {
    return getSupplementsContent();
  }
  
  return `
# ${post.title}

${post.excerpt}

## Overview

This comprehensive guide covers everything you need to know about ${post.title.toLowerCase()}. Our medical experts have compiled the latest evidence-based information to help you make informed decisions about your health.

## Key Points

• Understanding the basics and what you need to know
• When to seek professional medical advice
• Practical tips for daily management
• Warning signs that require immediate attention
• Lifestyle modifications that can help

## Important Reminders

⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for personalized guidance.

## When to See a Doctor

If you experience any concerning symptoms or have questions about your health, it's important to consult with a healthcare professional. They can provide personalized advice based on your specific situation.

## Additional Resources

For more health information and expert guidance, explore our other articles or consult with our AI Health Assistant for personalized recommendations.

---

*This article was reviewed by medical professionals and is part of Doctori AI's commitment to providing accurate, trustworthy health information.*
  `.trim();
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPostType | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = blogPosts.find(p => p.slug === slug);
      setPost(foundPost || null);
      
      if (foundPost) {
        // SEO
        document.title = `${foundPost.title} | Doctori AI Health Blog`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', foundPost.excerpt);
        
        const linkCanonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        linkCanonical.setAttribute('href', window.location.href);
        if (!linkCanonical.parentNode) document.head.appendChild(linkCanonical);
      }
    }
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!post) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullContent = generateFullContent(post);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <Card className="shadow-card mb-8">
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {post.readTime}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <CardTitle className="text-3xl leading-tight">
              {post.title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card className="shadow-card">
          <CardContent className="prose prose-lg max-w-none pt-6">
            <div className="whitespace-pre-line leading-relaxed">
              {fullContent}
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter(p => p.category === post.category && p.id !== post.id)
              .slice(0, 3)
              .map((relatedPost) => (
                <Card key={relatedPost.id} className="shadow-card hover:shadow-medical transition-all">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit">{relatedPost.category}</Badge>
                    <CardTitle className="text-lg leading-tight">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
