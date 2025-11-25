// import { useState } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Heart, MessageCircle, Plus, Send } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";

// const Community = () => {
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [posts, setPosts] = useState([
//     {
//       id: 1,
//       author: { full_name: "Alice" },
//       title: "My Trip to Paris",
//       content:
//         "Paris was amazing! I visited the Eiffel Tower, Louvre, and enjoyed delicious croissants.",
//       likes_count: 5,
//       user_liked: false,
//       comments: [{ count: 2 }],
//       created_at: new Date(),
//       cover_image:
//         "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
//     },
//     {
//       id: 2,
//       author: { full_name: "Bob" },
//       title: "Hiking Adventure",
//       content:
//         "Went hiking in the mountains. The view from the top was breathtaking!",
//       likes_count: 10,
//       user_liked: true,
//       comments: [{ count: 4 }],
//       created_at: new Date(),
//       cover_image: null,
//     },
//   ]);

//   const [newPost, setNewPost] = useState({ title: "", content: "" });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!newPost.title || !newPost.content) return;

//     const post = {
//       id: Date.now(),
//       author: { full_name: "You" },
//       title: newPost.title,
//       content: newPost.content,
//       likes_count: 0,
//       user_liked: false,
//       comments: [{ count: 0 }],
//       created_at: new Date(),
//       cover_image: null,
//     };

//     setPosts([post, ...posts]);
//     setNewPost({ title: "", content: "" });
//     setDialogOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Community</h1>
//           <p className="text-muted-foreground">
//             Share your stories and connect with fellow travelers
//           </p>
//         </div>

//         <div className="mb-6">
//           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//             <DialogTrigger asChild>
//               <Button size="lg">
//                 <Plus className="h-5 w-5 mr-2" />
//                 Share Your Story
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Create Post</DialogTitle>
//               </DialogHeader>
//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 <div>
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     placeholder="Give your story a title..."
//                     value={newPost.title}
//                     onChange={(e) =>
//                       setNewPost({ ...newPost, title: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="content">Your Story</Label>
//                   <Textarea
//                     id="content"
//                     name="content"
//                     placeholder="Share your travel experiences, tips, or memorable moments..."
//                     value={newPost.content}
//                     onChange={(e) =>
//                       setNewPost({ ...newPost, content: e.target.value })
//                     }
//                     required
//                     rows={8}
//                   />
//                 </div>
//                 <Button type="submit" className="w-full">
//                   <Send className="h-4 w-4 mr-2" />
//                   Publish Post
//                 </Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="space-y-6">
//           {posts.length === 0 ? (
//             <Card>
//               <CardContent className="py-12 text-center">
//                 <p className="text-muted-foreground">
//                   No posts yet. Be the first to share your story!
//                 </p>
//               </CardContent>
//             </Card>
//           ) : (
//             posts.map((post) => (
//               <Card
//                 key={post.id}
//                 className="hover:shadow-[var(--shadow-medium)] transition-shadow"
//               >
//                 <CardHeader>
//                   <div className="flex items-center gap-3 mb-4">
//                     <Avatar>
//                       <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
//                         {post.author?.full_name?.[0] || "U"}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium">{post.author?.full_name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {post.created_at.toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                   <h2 className="text-2xl font-bold">{post.title}</h2>
//                 </CardHeader>
//                 <CardContent>
//                   {post.cover_image && (
//                     <div className="mb-4 rounded-lg overflow-hidden">
//                       <img
//                         src={post.cover_image}
//                         alt={post.title}
//                         className="w-full h-64 object-cover"
//                       />
//                     </div>
//                   )}

//                   <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-4">
//                     {post.content}
//                   </p>

//                   <div className="flex items-center gap-4 pt-4 border-t border-border">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className={post.user_liked ? "text-destructive" : ""}
//                       onClick={() => {
//                         setPosts((prev) =>
//                           prev.map((p) =>
//                             p.id === post.id
//                               ? {
//                                   ...p,
//                                   user_liked: !p.user_liked,
//                                   likes_count: p.user_liked
//                                     ? p.likes_count - 1
//                                     : p.likes_count + 1,
//                                 }
//                               : p
//                           )
//                         );
//                       }}
//                     >
//                       <Heart
//                         className={`h-4 w-4 mr-2 ${
//                           post.user_liked ? "fill-current" : ""
//                         }`}
//                       />
//                       {post.likes_count}
//                     </Button>
//                     <Button variant="ghost" size="sm">
//                       <MessageCircle className="h-4 w-4 mr-2" />
//                       {post.comments?.[0]?.count || 0}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Community;
