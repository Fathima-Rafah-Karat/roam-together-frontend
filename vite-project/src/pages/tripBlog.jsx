// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Heart, FileText, Plus } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// export default function TripBlog() {
//     const [tripBlogs, setTripBlogs] = useState([]);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [form, setForm] = useState({ title: "", content: "", photo: null });
//     const [likedPosts, setLikedPosts] = useState({});

//     // Input change handler
//     const handleChange = (e) => {
//         const { id, value } = e.target;
//         setForm((prev) => ({ ...prev, [id]: value }));
//     };

//     // Create a new blog
//     const handleSave = async () => {
//         if (!form.title || !form.content || !form.photo) {
//             toast.error("Please fill in Title, Content, and Photo!");
//             return;
//         }

//         // ---- FORM DATA FOR FILE UPLOAD ----
//         const formData = new FormData();
//         formData.append("title", form.title);
//         formData.append("content", form.content);
//         formData.append("photo", form.photo);

//         try {
//             const res = await axios.post(
//                 "http://localhost:5000/api/traveler/blog",
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );

//             setTripBlogs([res.data.data, ...tripBlogs]);
//             setForm({ title: "", content: "", photo: null });
//             setDialogOpen(false);
//             toast.success("Trip blog created successfully!");

//         } catch (error) {
//             console.error(error);
//             toast.error("Failed to create trip blog");
//         }
//     };

//     // Fetch blogs
//     useEffect(() => {
//         const fetchBlogs = async () => {
//             try {
//                 const res = await axios.get("http://localhost:5000/api/traveler/blog/view");
//                 setTripBlogs(res.data.data);
//             } catch (error) {
//                 console.error(error);
//                 toast.error("Failed to fetch trip blogs");
//             }
//         };
//         fetchBlogs();
//     }, []);

//     // Toggle like
//     const handleLike = (id) => {
//         setLikedPosts((prevLiked) => {
//             const updatedLiked = { ...prevLiked, [id]: !prevLiked[id] };

//             setTripBlogs((prevBlogs) =>
//                 prevBlogs.map((blog) => {
//                     const blogId = blog._id || blog.id;
//                     if (blogId === id) {
//                         const isNowLiked = updatedLiked[id];
//                         return { ...blog, likes: isNowLiked ? blog.likes + 1 : blog.likes - 1 };
//                     }
//                     return blog;
//                 })
//             );

//             return updatedLiked;
//         });
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header + Create Dialog */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
//                         My Trip Blog
//                     </h1>
//                     <p className="text-muted-foreground text-lg">Share stories from your trips</p>
//                 </div>

//                 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                     <DialogTrigger asChild>
//                         <Button className="gap-2">
//                             <Plus className="h-4 w-4" />
//                             Create Post
//                         </Button>
//                     </DialogTrigger>

//                     <DialogContent className="sm:max-w-[700px]">
//                         <DialogHeader>
//                             <DialogTitle>Create New Trip Blog</DialogTitle>
//                             <DialogDescription>Write about your travel experience</DialogDescription>
//                         </DialogHeader>

//                         <div className="grid gap-4 py-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="title">Title</Label>
//                                 <Input id="title" value={form.title} onChange={handleChange} placeholder="Blog title" />
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="content">Content</Label>
//                                 <Textarea id="content" value={form.content} onChange={handleChange} placeholder="Write your story..." className="min-h-[150px]" />
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="photo">Photo</Label>
//                                 <Input
//                                     id="photo"
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
//                                 />
//                             </div>
//                         </div>

//                         <DialogFooter>
//                             <Button onClick={handleSave}>Save Post</Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             </div>

//             {/* Blog List */}
//             {tripBlogs.length === 0 ? (
//                 <Card className="p-12 text-center">
//                     <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
//                     <h3 className="text-xl font-semibold mt-4">No trip blogs yet</h3>
//                     <p className="text-muted-foreground mt-2">Create your first post to share your travel experiences!</p>
//                 </Card>
//             ) : (
//                 <div className="grid gap-6 md:grid-cols-2">
//                     {tripBlogs.map((post) => {
//                         const id = post._id || post.id;
//                         const isLiked = likedPosts[id];

//                         return (
//                             <Card key={id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
//                                 <CardHeader className="flex-1">
//                                     <CardTitle className="text-xl hover:text-primary cursor-pointer transition-colors">
//                                         {post.title}
//                                     </CardTitle>
//                                 </CardHeader>

//                                 <CardContent>
//                                     <CardDescription>{post.content}</CardDescription>
//                                 </CardContent>

//                                 <CardFooter className="flex justify-between border-t border-border pt-4">
//                                     <button
//                                         className="flex items-center gap-1 text-sm transition-colors text-muted-foreground"
//                                         onClick={() => handleLike(id)}
//                                     >
//                                         <Heart
//                                             className={`h-4 w-4 transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
//                                             fill={isLiked ? "currentColor" : "none"}
//                                             strokeWidth={isLiked ? 0 : 2}
//                                         />
//                                         {post.likes}
//                                     </button>
//                                 </CardFooter>
//                             </Card>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function TripBlog() {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [tripBlogs, setTripBlogs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", photo: null });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [doubleTap, setDoubleTap] = useState({});

  useEffect(() => {
    const savedLiked = JSON.parse(localStorage.getItem("likedPosts")) || {};
    setLikedPosts(savedLiked);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setForm((prev) => ({ ...prev, photo: file }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.photo) {
      toast.error("Please fill Title, Content and Photo");
      return;
    }

    setLoadingCreate(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("photo", form.photo);

      const res = await axios.post(
        "http://localhost:5000/api/traveler/blog",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const created = res.data?.data;
      setTripBlogs((prev) => [created, ...prev]);

      setForm({ title: "", content: "", photo: null });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setDialogOpen(false);
      toast.success("Blog created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Create failed");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleLike = (id) => {
    setLikedPosts((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("likedPosts", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDoubleTap = (id) => {
    setDoubleTap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setDoubleTap((prev) => ({ ...prev, [id]: false })), 700);

    setTimeout(() => {
      if (!likedPosts[id]) {
        setLikedPosts((prev) => {
          const updated = { ...prev, [id]: true };
          localStorage.setItem("likedPosts", JSON.stringify(updated));
          return updated;
        });
      }
    }, 50);
  };

  const handleImageClick = (() => {
    let lastTap = 0;
    return (id) => {
      const now = Date.now();
      const gap = now - lastTap;
      if (gap < 300 && gap > 0) handleDoubleTap(id);
      lastTap = now;
    };
  })();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoadingFetch(true);
      try {
        const res = await axios.get("http://localhost:5000/api/traveler/blog/view");
        setTripBlogs(res.data.data);
      } catch {
        toast.error("Failed to fetch blogs");
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> 
      </Button>

      {/* Header */}
      {!selectedBlog && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">My Trip Blog</h1>
            <p className="text-muted-foreground">Share your travel stories</p>
          </div>

          {/* Create Post Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Create New Trip Blog</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div>
                  <Label>Title</Label>
                  <Input id="title" value={form.title} onChange={handleChange} />
                </div>

                <div>
                  <Label>Content</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={handleChange}
                    className="min-h-[150px]"
                  />
                </div>

                <div>
                  <Label>Photo</Label>
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} />

                  {previewUrl && (
                    <img
                      src={previewUrl}
                      className="w-full max-h-56 object-cover mt-2 rounded-md"
                    />
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button disabled={loadingCreate} onClick={handleSave}>
                  {loadingCreate ? "Saving..." : "Save Post"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* FULL VIEW SINGLE BLOG */}
      {selectedBlog ? (
        <Card className="p-6 border">
          <Button
            variant="ghost"
            onClick={() => setSelectedBlog(null)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {selectedBlog.photo && (
            <div
              onClick={() => handleImageClick(selectedBlog._id)}
              className="relative cursor-pointer"
            >
              <img
                src={`http://localhost:5000/${selectedBlog.photo}`}
                className="w-full max-h-[400px] object-cover rounded-lg"
              />

              {doubleTap[selectedBlog._id] && (
                <Heart
                  className="absolute inset-0 m-auto text-red-500"
                  size={120}
                  fill="red"
                  stroke="none"
                  style={{ animation: "pop 0.7s ease-out" }}
                />
              )}
            </div>
          )}

          <h2 className="text-3xl font-bold mt-4">{selectedBlog.title}</h2>
          <p className="text-gray-700 mt-2 whitespace-pre-line">{selectedBlog.content}</p>

          <div className="mt-4">
            <Button variant="ghost" onClick={() => handleLike(selectedBlog._id)}>
              <Heart
                className={likedPosts[selectedBlog._id] ? "text-red-500" : ""}
                fill={likedPosts[selectedBlog._id] ? "red" : "none"}
              />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tripBlogs.map((post) => {
            const id = post._id;
            const isLiked = likedPosts[id];
            const photoSrc = post.photo ? `http://localhost:5000/${post.photo.replace(/^\//, "")}` : null;

            return (
              <Card key={id} className="overflow-hidden cursor-pointer" onClick={() => setSelectedBlog(post)}>
                {photoSrc && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(id);
                    }}
                    className="relative"
                  >
                    <img src={photoSrc} className="w-full h-56 object-cover" />
                    {doubleTap[id] && (
                      <Heart
                        className="absolute inset-0 m-auto text-red-500"
                        size={90}
                        fill="red"
                        stroke="none"
                        style={{ animation: "pop 0.7s ease-out" }}
                      />
                    )}
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="line-clamp-3">{post.content}</CardDescription>
                </CardContent>

                <CardFooter className="border-t pt-4">
                  <button
                    className="flex items-center gap-2 text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(id);
                    }}
                  >
                    <Heart className={isLiked ? "text-red-500" : ""} fill={isLiked ? "red" : "none"} />
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
