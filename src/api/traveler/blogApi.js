import api from "../axios";

/**
 * Create a new trip blog
 */
export const createTripBlog = async (formData) => {
  const res = await api.post(
    "/api/traveler/blog",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

/**
 * Get all trip blogs
 */
export const getTripBlogs = async () => {
  const res = await api.get(
    "/api/traveler/blog/view"
  );
  return res.data;
};
