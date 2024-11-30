import express from "express";
import Grade from "../models/Grade.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let newGrade = req.body;

    if (newGrade.student_id) {
      newGrade.learner_id = newGrade.student_id;
      delete newGrade.student_id;
    }

    const result = await Grade.create(newGrade);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Failed to create grade entry.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Grade.findById(req.params.id);
    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error fetching grade entry.");
  }
});

router.patch("/:id/add", async (req, res) => {
  try {
    const result = await Grade.findByIdAndUpdate(
      req.params.id,
      { $push: { scores: req.body } },
      { new: true }
    );
    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error adding score.");
  }
});

router.patch("/:id/remove", async (req, res) => {
  try {
    const result = await Grade.findByIdAndUpdate(
      req.params.id,
      { $pull: { scores: req.body } },
      { new: true }
    );
    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error removing score.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Grade.findByIdAndDelete(req.params.id);
    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error deleting grade entry.");
  }
});

router.get("/learner/:id", async (req, res) => {
  try {
    const query = { learner_id: Number(req.params.id) };

    if (req.query.class) query.class_id = Number(req.query.class);

    const result = await Grade.find(query);
    if (!result || result.length === 0) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error fetching learner's grades.");
  }
});

router.delete("/learner/:id", async (req, res) => {
  try {
    const result = await Grade.deleteMany({ learner_id: Number(req.params.id) });
    if (!result.deletedCount) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error deleting learner's grades.");
  }
});

router.get("/class/:id", async (req, res) => {
  try {
    const query = { class_id: Number(req.params.id) };

    if (req.query.learner) query.learner_id = Number(req.query.learner);

    const result = await Grade.find(query);
    if (!result || result.length === 0) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error fetching class grades.");
  }
});

router.patch("/class/:id", async (req, res) => {
  try {
    const result = await Grade.updateMany(
      { class_id: Number(req.params.id) },
      { class_id: req.body.class_id }
    );
    if (!result.matchedCount) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error updating class id.");
  }
});

router.delete("/class/:id", async (req, res) => {
  try {
    const result = await Grade.deleteMany({ class_id: Number(req.params.id) });
    if (!result.deletedCount) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error deleting class.");
  }
});

export default router;
