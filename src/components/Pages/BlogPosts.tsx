// import React, { useState } from 'react';
// import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
// import { BlogPost } from '../../types/admin';
// import { mockBlogPosts } from '../../data/mockData';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
// import Modal from '../UI/Modal';
// import Button from '../UI/Button';

// const categories = [
//   'AI & Robotics in Real Life',
//   'Robot Maintenance Tips',
//   'News from Fortune Robotics',
//   'Industry Trends',
//   'Buying & Renting Guide'
// ];

// export default function BlogPosts() {
//   const [posts, setPosts] = useLocalStorage<BlogPost[]>('blogPosts', mockBlogPosts);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
//   const [formData, setFormData] = useState<Partial<BlogPost>>({});

//   const filteredPosts = posts.filter(post => {
//     const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
//     const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   const handleAdd = () => {
//     setEditingPost(null);
//     setFormData({
//       title: '',
//       slug: '',
//       excerpt: '',
//       content: '',
//       category: categories[0],
//       author: 'Fortune Robotics Team',
//       featuredImage: '',
//       tags: [],
//       status: 'draft'
//     });
//     setIsModalOpen(true);
//   };

//   const handleEdit = (post: BlogPost) => {
//     setEditingPost(post);
//     setFormData(post);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     if (confirm('Are you sure you want to delete this blog post?')) {
//       setPosts(posts.filter(post => post.id !== id));
//     }
//   };

//   const handleSave = () => {
//     if (!formData.title || !formData.content) return;

//     // Generate slug from title if not provided
//     const slug = formData.slug || formData.title!.toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)+/g, '');

//     if (editingPost) {
//       setPosts(posts.map(post => 
//         post.id === editingPost.id 
//           ? { ...post, ...formData, slug, updatedAt: new Date().toISOString() }
//           : post
//       ));
//     } else {
//       const newPost: BlogPost = {
//         ...formData,
//         id: Date.now().toString(),
//         slug,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       } as BlogPost;
//       setPosts([...posts, newPost]);
//     }

//     setIsModalOpen(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
//         <Button onClick={handleAdd}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Post
//         </Button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
//         <div className="flex-1 max-w-md">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <input
//               type="text"
//               placeholder="Search posts..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="all">All Categories</option>
//             {categories.map(category => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>
//           <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="all">All Status</option>
//             <option value="published">Published</option>
//             <option value="draft">Draft</option>
//           </select>
//         </div>
//       </div>

//       {/* Posts Table */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Post
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Author
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredPosts.map((post) => (
//                 <tr key={post.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-12 w-12">
//                         <img
//                           className="h-12 w-12 rounded object-cover"
//                           src={post.featuredImage}
//                           alt={post.title}
//                         />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{post.title}</div>
//                         <div className="text-sm text-gray-500">{post.excerpt.substring(0, 60)}...</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                       {post.category}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       post.status === 'published'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {post.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {post.author}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(post.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex justify-end space-x-2">
//                       <button
//                         onClick={() => handleEdit(post)}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(post.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {filteredPosts.length === 0 && (
//         <div className="text-center py-12">
//           <div className="mx-auto h-12 w-12 text-gray-400">📝</div>
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
//           <p className="mt-1 text-sm text-gray-500">Get started by creating a new blog post.</p>
//         </div>
//       )}

//       {/* Add/Edit Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
//         size="xl"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               type="text"
//               value={formData.title || ''}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Blog post title"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//               <select
//                 value={formData.category || ''}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               >
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 value={formData.status || ''}
//                 onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPost['status'] })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="draft">Draft</option>
//                 <option value="published">Published</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
//             <textarea
//               value={formData.excerpt || ''}
//               onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               rows={2}
//               placeholder="Brief description of the blog post"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
//             <textarea
//               value={formData.content || ''}
//               onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               rows={8}
//               placeholder="Write your blog post content here..."
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
//               <input
//                 type="url"
//                 value={formData.featuredImage || ''}
//                 onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="https://example.com/featured-image.jpg"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
//               <input
//                 type="text"
//                 value={formData.tags?.join(', ') || ''}
//                 onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="robotics, AI, automation"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
//               <input
//                 type="text"
//                 value={formData.seoTitle || ''}
//                 onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="SEO optimized title"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
//               <input
//                 type="text"
//                 value={formData.seoDescription || ''}
//                 onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="SEO meta description"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>
//               {editingPost ? 'Update' : 'Create'} Post
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }