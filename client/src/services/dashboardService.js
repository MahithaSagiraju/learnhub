import api from "./api";

export const dashboardService = {
  getStudentStats: () => api.get("/dashboard/student/stats"),
  getEnrolledCourses: () => api.get("/dashboard/student/courses"),
};
