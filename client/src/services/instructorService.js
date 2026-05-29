import api from "./api";

export const instructorService = {
  getStats: () => api.get("/instructor/stats"),
  createCourse: (data) => api.post("/instructor/courses", data),
  updateCourse: (id, data) => api.put(`/instructor/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/instructor/courses/${id}`),
  getCourseDetails: (id) => api.get(`/instructor/courses/${id}`),
  addLecture: (courseId, data) => api.post(`/instructor/courses/${courseId}/lectures`, data),
  updateLecture: (id, data) => api.put(`/instructor/lectures/${id}`, data),
  deleteLecture: (id) => api.delete(`/instructor/lectures/${id}`),
};
