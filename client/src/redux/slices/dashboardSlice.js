import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardService } from "../../services/dashboardService";

export const fetchStudentStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardService.getStudentStats();
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load dashboard");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    enrolledCourses: [],
    certificates: [],
    recentActivity: [],
    recommendedCourses: [],
    progressOverTime: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.enrolledCourses = action.payload.enrolledCourses;
        state.certificates = action.payload.certificates;
        state.recentActivity = action.payload.recentActivity;
        state.recommendedCourses = action.payload.recommendedCourses;
        state.progressOverTime = action.payload.progressOverTime;
      })
      .addCase(fetchStudentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
