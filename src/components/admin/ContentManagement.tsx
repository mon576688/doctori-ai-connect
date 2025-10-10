import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlogContent {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
  priority: number;
  is_active: boolean;
}

export default function ContentManagement() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<BlogContent[]>([]);
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<BlogContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Note: These tables would need to be created in the database
      // For now, using mock data
      setBlogs([]);
      setHealthTips([]);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlog = async (blogData: Partial<BlogContent>) => {
    try {
      // Would save to database here
      toast({
        title: 'Success',
        description: editingBlog ? 'Blog updated' : 'Blog created',
      });
      setIsDialogOpen(false);
      setEditingBlog(null);
      fetchContent();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save blog',
        variant: 'destructive'
      });
    }
  };

  const BlogEditor = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'New Blog Post'}</DialogTitle>
          <DialogDescription>
            Create or edit blog content for your health platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter blog title"
              defaultValue={editingBlog?.title}
            />
          </div>
          
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="blog-url-slug"
              defaultValue={editingBlog?.slug}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select defaultValue={editingBlog?.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="children">Children's Health</SelectItem>
                <SelectItem value="diseases">Diseases and Conditions</SelectItem>
                <SelectItem value="healthy-living">Healthy Living</SelectItem>
                <SelectItem value="mens-health">Men's Health</SelectItem>
                <SelectItem value="womens-health">Women's Health</SelectItem>
                <SelectItem value="nutrition">Nutrition and Fitness</SelectItem>
                <SelectItem value="treatments">Treatments and Prevention</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of the blog post"
              defaultValue={editingBlog?.excerpt}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Full blog content (supports Markdown)"
              defaultValue={editingBlog?.content}
              rows={10}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={editingBlog?.status || 'draft'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSaveBlog({})}>
            {editingBlog ? 'Update' : 'Create'} Blog Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage blogs, health tips, and educational content</p>
        </div>
      </div>

      <Tabs defaultValue="blogs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
          <TabsTrigger value="health-tips">Health Tips</TabsTrigger>
          <TabsTrigger value="medicine-data">Medicine Database</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>Manage educational blog content</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingBlog(null);
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Blog Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No blog posts yet. Create your first blog post to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-tips" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Health Tips</CardTitle>
                  <CardDescription>Quick health advice and tips</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Health Tip
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Health tips management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicine-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Database</CardTitle>
              <CardDescription>Manage medicine information and cache</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search medicine by name..." />
                  <Button>Search</Button>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Medicine database management coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BlogEditor />
    </div>
  );
}
