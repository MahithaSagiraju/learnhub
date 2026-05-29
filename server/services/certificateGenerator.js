import PDFDocument from "pdfkit";

const generateCertificate = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        info: {
          Title: `Certificate of Completion - ${data.courseTitle}`,
          Author: "LearnHub",
          Subject: "Course Completion Certificate",
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const width = doc.page.width;
      const height = doc.page.height;

      doc.rect(0, 0, width, height).fill("#f8fafc");

      doc.rect(30, 30, width - 60, height - 60).lineWidth(3).stroke("#4f46e5");

      doc.rect(40, 40, width - 80, height - 80).lineWidth(1).stroke("#c7d2fe");

      doc.fontSize(36).font("Helvetica-Bold").fillColor("#1e293b").text("CERTIFICATE", { align: "center", valign: "top" });
      doc.moveDown(0.5);
      doc.fontSize(14).font("Helvetica").fillColor("#64748b").text("OF COMPLETION", { align: "center" });

      doc.moveDown(2);
      doc.fontSize(12).font("Helvetica").fillColor("#475569").text("This is to certify that", { align: "center" });
      doc.moveDown(0.5);

      doc.fontSize(28).font("Helvetica-Bold").fillColor("#4f46e5").text(data.studentName, { align: "center" });
      doc.moveDown(0.5);

      doc.fontSize(12).font("Helvetica").fillColor("#475569").text("has successfully completed the course", { align: "center" });
      doc.moveDown(0.5);

      doc.fontSize(20).font("Helvetica-Bold").fillColor("#1e293b").text(data.courseTitle, { align: "center" });
      doc.moveDown(0.5);

      doc.fontSize(11).font("Helvetica").fillColor("#64748b").text(
        `with a grade of ${data.grade} and a score of ${data.score}%`,
        { align: "center" }
      );
      doc.moveDown(0.5);

      doc.fontSize(10).font("Helvetica").fillColor("#64748b").text(
        `Awarded on ${data.issueDate} ${data.duration ? `· Duration: ${data.duration}` : ""}`,
        { align: "center" }
      );

      doc.moveDown(4);
      doc.fontSize(10).font("Helvetica").fillColor("#94a3b8").text(
        `Certificate ID: ${data.certificateId}`,
        { align: "center" }
      );

      doc.moveDown(0.5);
      doc.fontSize(8).font("Helvetica").fillColor("#cbd5e1").text(
        "Verify at: https://learnhub.com/verify",
        { align: "center" }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateCertificate;
