import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentMockData = [...assignments];
let commentsMockData = [...comments];

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignmentsWithLimit = assignmentMockData.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsWithLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  const id = Number(req.params.assignmentsId);
  const data = assignmentMockData.filter((item) => item.id === id);

  return res.json({
    message: "Complete Fetching assignments",
    data: data,
  });
});

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  const id = Number(req.params.assignmentsId);
  const data = commentsMockData.filter((item) => item.assignmentId === id);
  res.json({
    message: "Complete fetching comments",
    data: data,
  });
});

app.post("/assignments", (req, res) => {
  assignmentMockData.push({
    id: assignmentMockData[assignmentMockData.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentMockData[assignmentMockData.length - 1],
  });
});

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  commentsMockData.push({
    id: commentsMockData[commentsMockData.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New comment has been created successfully",
    data: commentsMockData[commentsMockData.length - 1],
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  const id = Number(req.params.assignmentsId);
  const data = assignmentMockData.filter((item) => item.id !== id);

  if (assignmentMockData.filter((item) => item.id === id).length === 0) {
    return res.status(401).json({
      message: "Cannot delete, No data available!",
    });
  }

  assignmentMockData = data;

  return res.json({
    message: `Assignment Id : ${id}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  const id = Number(req.params.assignmentsId);
  const data = assignmentMockData.findIndex((item) => item.id === id);

  if (id > assignmentMockData.length) {
    return res.status(401).json({
      message: "Cannot update, No data available!",
    });
  }

  assignmentMockData[data] = { id: id, ...req.body };

  return res.json({
    message: `Assignment Id : ${id}  has been updated successfully`,
    data: assignmentMockData[data],
  });
});

app.listen(port, () => {
  console.log(`Server in running on Port ${port}`);
});
