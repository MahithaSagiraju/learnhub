import Assignment from "../models/Assignment.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getCourseAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
      isPublished: true,
    })
      .select("title description dueDate totalMarks passingMarks moduleIndex")
      .sort("moduleIndex");
    res.json(new ApiResponse(200, { assignments }));
  } catch (error) {
    next(error);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .select("-submissions");
    if (!assignment) throw new ApiError(404, "Assignment not found");

    let mySubmission = null;
    if (req.user) {
      const fullAssignment = await Assignment.findById(req.params.id);
      mySubmission = fullAssignment.submissions.find(
        (s) => s.student.toString() === req.user.id
      );
    }

    res.json(new ApiResponse(200, { assignment, mySubmission }));
  } catch (error) {
    next(error);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) throw new ApiError(404, "Assignment not found");

    const existingSubmission = assignment.submissions.find(
      (s) => s.student.toString() === req.user.id
    );
    if (existingSubmission) {
      throw new ApiError(400, "Already submitted");
    }

    const { text, fileUrl } = req.body;
    assignment.submissions.push({
      student: req.user.id,
      text: text || "",
      fileUrl: fileUrl || "",
      submittedAt: new Date(),
      status: assignment.dueDate && new Date() > assignment.dueDate ? "late" : "submitted",
    });

    await assignment.save();
    res.json(new ApiResponse(200, null, "Assignment submitted"));
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) throw new ApiError(404, "Assignment not found");

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) throw new ApiError(404, "Submission not found");

    submission.marksObtained = marks;
    submission.feedback = feedback || "";
    submission.status = "graded";
    await assignment.save();

    res.json(new ApiResponse(200, { submission }));
  } catch (error) {
    next(error);
  }
};
