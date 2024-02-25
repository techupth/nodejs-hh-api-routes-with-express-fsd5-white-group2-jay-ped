import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = express();
const port = 4000;

let assignmentMockDatabase = [...assignments];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ดูแบบทดสอบทั้งหมด โดยต้องส่ง Query limit มาเป็น Number ไม่เกิน 10
app.get("/assignments", (req, res) => {
  const dataLimit = req.query.limit;
  if (dataLimit > 10) {
    return res.json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentResponse = assignmentMockDatabase.slice(0, dataLimit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentResponse,
  });
});

//	ดูแบบทดสอบแต่ละอันด้วย :assignmentsId
app.get("/assignments/:assignmentsId", (req, res) => {
  const idFromClient = Number(req.params.assignmentsId);
  const assignmentResponseById = assignments.filter((item) => {
    return item.id === idFromClient;
  });

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentResponseById,
  });
});

//สร้างแบบทดสอบใหม่
app.post("/assignments", (req, res) => {
  let assignmentFromClient;
  let newAssignmentId =
    assignmentMockDatabase[assignmentMockDatabase.length - 1].id + 1;
  assignmentFromClient = { id: newAssignmentId, ...req.body };

  assignmentMockDatabase.push(assignmentFromClient);

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentMockDatabase[assignmentMockDatabase.length - 1],
  });
});

//	ลบแบบทดสอบแต่ละอันด้วย :assignmentsId
app.delete("/assignments/:assignmentsId", (req, res) => {
  const idFromClient = Number(req.params.assignmentsId);
  const findId = assignmentMockDatabase.find((item) => {
    return item.id === idFromClient;
  });

  if (!findId) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }
  const newDataAssignments = assignmentMockDatabase.filter((item) => {
    return item.id !== idFromClient;
  });

  assignmentMockDatabase = newDataAssignments;

  return res.json({
    message: `Assignment Id : ${idFromClient}  has been deleted successfully`,
  });
});

//	แก้ไขแบบทดสอบแต่ละอันด้วย :assignmentsId
app.put("/assignments/:assignmentsId", (req, res) => {
  const idFromClient = Number(req.params.assignmentsId);
  const assignmentIndex = assignmentMockDatabase.findIndex(
    (item) => item.id === idFromClient
  );

  if (idFromClient > assignmentMockDatabase.length) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }

  assignmentMockDatabase[assignmentIndex] = { id: idFromClient, ...req.body };

  return res.json({
    message: `Assignment Id : ${idFromClient}  has been updated successfully`,
    data: assignmentMockDatabase[assignmentIndex],
  });
});

//***Comments Exercise เสริม
let commentMockDatabase = [...comments];
//ดูคอมเม้นต์ของแบบทดสอบนั้น ๆ ด้วย :assignmentsId
app.get("/assignments/:assignmentsId/comments", (req, res) => {
  const idFromClient = Number(req.params.assignmentsId);
  const commentResponse = commentMockDatabase.filter(
    (item) => item.assignmentId === idFromClient
  );
  return res.json({
    message: "Complete fetching comments",
    data: commentResponse,
  });
});
//	เพิ่มคอมเม้นต์เข้าไปในแบบทดสอบนั้น ๆ ด้วย :assignmentsId
app.post("/assignments/:assignmentsId/comments", (req, res) => {
  const newCommentData = {
    id: commentMockDatabase[commentMockDatabase.length - 1].id + 1,
    ...req.body,
  };

  commentMockDatabase.push(newCommentData);
  return res.json({
    message: "New comment has been created successfully",
  });
});
//npm run start (Start Server)
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
