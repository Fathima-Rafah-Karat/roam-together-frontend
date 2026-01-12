import api from "../axios";

/* =========================
   GET ALL DIARIES
========================= */
export const getDiaries = async () => {
  const res = await api.get("/api/traveler/diary/diaries");

  // ✅ Normalize response
  return res.data.data ?? res.data.diaries ?? [];
};

/* =========================
   CREATE DIARY
========================= */
export const createDiary = async (payload) => {
  const res = await api.post("/api/traveler/diary", payload);
  return res.data.data;
};

/* =========================
   UPDATE DIARY
========================= */
export const updateDiary = async (id, payload) => {
  const res = await api.put(`/api/traveler/diary/${id}`, payload);
  return res.data.data;
};

/* =========================
   DELETE DIARY
========================= */
export const deleteDiary = async (id) => {
  const res = await api.delete(`/api/traveler/diary/${id}`);
  return res.data;
};
