import Certificate from "../models/Certificate.js";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import generateCertificate from "../services/certificateGenerator.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const issueCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const progress = await Progress.findOne({ student: userId, course: courseId })
      .populate("course", "title instructor modules totalDuration");

    if (!progress) {
      throw new ApiError(404, "Course progress not found");
    }

    const totalLectures = progress.course?.modules?.reduce(
      (sum, m) => sum + (m.lectures?.length || 0), 0
    ) || 0;
    const completedLectures = progress.completedLectures?.length || 0;
    const completionPercent = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    if (completionPercent < 80) {
      throw new ApiError(400, "Complete at least 80% of the course to get a certificate");
    }

    const existingCert = await Certificate.findOne({ student: userId, course: courseId });
    if (existingCert) {
      throw new ApiError(409, "Certificate already issued for this course");
    }

    const quizResults = progress.quizResults || [];
    const avgQuizScore = quizResults.length > 0
      ? Math.round(quizResults.reduce((s, q) => s + (q.total > 0 ? (q.score / q.total) * 100 : 0), 0) / quizResults.length)
      : 0;

    const score = Math.max(completionPercent, avgQuizScore);

    let grade = "Pass";
    if (score >= 90) grade = "A+";
    else if (score >= 80) grade = "A";
    else if (score >= 70) grade = "B+";
    else if (score >= 60) grade = "B";
    else if (score >= 50) grade = "C+";
    else if (score >= 40) grade = "C";
    else grade = "Pass";

    const user = await User.findById(userId);
    const course = progress.course;
    const instructor = await User.findById(course.instructor);

    const certificate = await Certificate.create({
      student: userId,
      course: courseId,
      grade,
      score,
      metadata: {
        courseTitle: course.title,
        studentName: user.name,
        instructorName: instructor?.name || "Instructor",
        duration: course.totalDuration || "",
      },
    });

    const pdfBuffer = await generateCertificate({
      studentName: user.name,
      courseTitle: course.title,
      grade,
      score,
      certificateId: certificate.certificateId,
      issueDate: certificate.issueDate.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }),
      duration: course.totalDuration,
    });

    certificate.downloadUrl = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;
    await certificate.save();

    res.status(201).json(new ApiResponse(201, { certificate }));
  } catch (error) {
    next(error);
  }
};

export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate("course", "title thumbnail category")
      .sort("-issueDate");

    res.json(new ApiResponse(200, { certificates }));
  } catch (error) {
    next(error);
  }
};

export const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate("student", "name")
      .populate("course", "title totalDuration")
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name" },
      });

    if (!certificate) {
      throw new ApiError(404, "Certificate not found");
    }

    if (certificate.student._id.toString() !== req.user.id && req.user.role !== "admin") {
      throw new ApiError(403, "Not authorized to download this certificate");
    }

    if (certificate.downloadUrl) {
      const base64Data = certificate.downloadUrl.split(",")[1];
      if (base64Data) {
        const pdfBuffer = Buffer.from(base64Data, "base64");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${certificate.certificateId}.pdf"`);
        return res.send(pdfBuffer);
      }
    }

    const pdfBuffer = await generateCertificate({
      studentName: certificate.student.name,
      courseTitle: certificate.course.title,
      grade: certificate.grade,
      score: certificate.score,
      certificateId: certificate.certificateId,
      issueDate: certificate.issueDate.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }),
      duration: certificate.course.totalDuration,
    });

    certificate.downloadUrl = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;
    await certificate.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${certificate.certificateId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate("student", "name email")
      .populate("course", "title category level");

    if (!certificate) {
      throw new ApiError(404, "Invalid certificate ID");
    }

    res.json(
      new ApiResponse(200, {
        valid: true,
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.student.name,
          courseTitle: certificate.course.title,
          grade: certificate.grade,
          score: certificate.score,
          issueDate: certificate.issueDate,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};
