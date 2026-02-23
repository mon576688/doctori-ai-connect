import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { FileText, Plus, Edit, Trash2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
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
  created_at: string;
}

export default function ContentManagement() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<HealthTip | null>(null);
  const [isTipDialogOpen, setIsTipDialogOpen] = useState(false);

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '', status: 'draft'
  });

  // Tip form state
  const [tipForm, setTipForm] = useState({
    title: '', content: '', category: '', icon: '💡', priority: 0, is_active: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [blogsRes, tipsRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('health_tips').select('*').order('priority', { ascending: false }),
      ]);

      if (blogsRes.data) setBlogs(blogsRes.data as BlogPost[]);
      if (tipsRes.data) setHealthTips(tipsRes.data as HealthTip[]);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({ title: 'Error', description: 'Failed to load content', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openBlogEditor = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '',
        content: blog.content || '', category: blog.category || '', status: blog.status
      });
    } else {
      setEditingBlog(null);
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: '', status: 'draft' });
    }
    setIsBlogDialogOpen(true);
  };

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.slug) {
      toast({ title: 'Error', description: 'Title and slug are required', variant: 'destructive' });
      return;
    }
    try {
      if (editingBlog) {
        const { error } = await supabase.from('blog_posts').update(blogForm).eq('id', editingBlog.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(blogForm);
        if (error) throw error;
      }
      toast({ title: 'Success', description: editingBlog ? 'Blog updated' : 'Blog created' });
      setIsBlogDialogOpen(false);
      fetchContent();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save blog', variant: 'destructive' });
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Blog post deleted' });
      fetchContent();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const openTipEditor = (tip?: HealthTip) => {
    if (tip) {
      setEditingTip(tip);
      setTipForm({
        title: tip.title, content: tip.content || '', category: tip.category || '',
        icon: tip.icon || '💡', priority: tip.priority, is_active: tip.is_active
      });
    } else {
      setEditingTip(null);
      setTipForm({ title: '', content: '', category: '', icon: '💡', priority: 0, is_active: true });
    }
    setIsTipDialogOpen(true);
  };

  const handleSaveTip = async () => {
    if (!tipForm.title) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    try {
      if (editingTip) {
        const { error } = await supabase.from('health_tips').update(tipForm).eq('id', editingTip.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('health_tips').insert(tipForm);
        if (error) throw error;
      }
      toast({ title: 'Success', description: editingTip ? 'Tip updated' : 'Tip created' });
      setIsTipDialogOpen(false);
      fetchContent();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save tip', variant: 'destructive' });
    }
  };

  const handleDeleteTip = async (id: string) => {
    try {
      const { error } = await supabase.from('health_tips').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Health tip deleted' });
      fetchContent();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

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

        {/* Blog Posts Tab */}
        <TabsContent value="blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>Manage educational blog content</CardDescription>
                </div>
                <Button onClick={() => openBlogEditor()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Blog Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No blog posts yet. Create your first blog post to get started.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">{blog.title}</TableCell>
                        <TableCell>{blog.category || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                            {blog.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openBlogEditor(blog)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteBlog(blog.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tips Tab */}
        <TabsContent value="health-tips" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Health Tips</CardTitle>
                  <CardDescription>Quick health advice and tips</CardDescription>
                </div>
                <Button onClick={() => openTipEditor()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Health Tip
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {healthTips.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No health tips yet. Create your first health tip to get started.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthTips.map((tip) => (
                      <TableRow key={tip.id}>
                        <TableCell>{tip.icon || '💡'}</TableCell>
                        <TableCell className="font-medium">{tip.title}</TableCell>
                        <TableCell>{tip.category || '-'}</TableCell>
                        <TableCell>{tip.priority}</TableCell>
                        <TableCell>
                          <Badge variant={tip.is_active ? 'default' : 'secondary'}>
                            {tip.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openTipEditor(tip)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteTip(tip.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medicine Database Tab */}
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

      {/* Blog Editor Dialog */}
      <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'New Blog Post'}</DialogTitle>
            <DialogDescription>Create or edit blog content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="blog-title">Title</Label>
              <Input id="blog-title" value={blogForm.title} onChange={(e) => setBlogForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="blog-slug">Slug</Label>
              <Input id="blog-slug" value={blogForm.slug} onChange={(e) => setBlogForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={blogForm.category} onValueChange={(v) => setBlogForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
              <Label htmlFor="blog-excerpt">Excerpt</Label>
              <Textarea id="blog-excerpt" rows={3} value={blogForm.excerpt} onChange={(e) => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="blog-content">Content</Label>
              <Textarea id="blog-content" rows={10} value={blogForm.content} onChange={(e) => setBlogForm(f => ({ ...f, content: e.target.value }))} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={blogForm.status} onValueChange={(v) => setBlogForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlogDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBlog}>{editingBlog ? 'Update' : 'Create'} Blog Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Health Tip Editor Dialog */}
      <Dialog open={isTipDialogOpen} onOpenChange={setIsTipDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTip ? 'Edit Health Tip' : 'New Health Tip'}</DialogTitle>
            <DialogDescription>Create or edit a health tip</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tip-title">Title</Label>
              <Input id="tip-title" value={tipForm.title} onChange={(e) => setTipForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="tip-content">Content</Label>
              <Textarea id="tip-content" rows={4} value={tipForm.content} onChange={(e) => setTipForm(f => ({ ...f, content: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tip-category">Category</Label>
                <Input id="tip-category" value={tipForm.category} onChange={(e) => setTipForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="tip-icon">Icon (emoji)</Label>
                <Input id="tip-icon" value={tipForm.icon} onChange={(e) => setTipForm(f => ({ ...f, icon: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="tip-priority">Priority</Label>
              <Input id="tip-priority" type="number" value={tipForm.priority} onChange={(e) => setTipForm(f => ({ ...f, priority: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTipDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTip}>{editingTip ? 'Update' : 'Create'} Health Tip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
