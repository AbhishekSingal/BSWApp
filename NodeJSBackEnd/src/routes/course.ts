// routes/course.ts
import { Router } from "express";
import { PrismaClient } from "../../generated/prisma";
import { AuthRequest, verifyToken } from "../middleware/token";

const router = Router();
const prisma = new PrismaClient();

/**
 * Get course details by code
 */
router.get("/:code", verifyToken, async (req: AuthRequest, res) => {
  const courseCode = req.params.code;

  try {
    const course = await prisma.course.findUnique({
      where: { code: courseCode },
      select: {
        id: true,
        code: true,
        name: true,
        content: true,
        contentVersion: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get course statistics
 */
router.get("/:code/stats", verifyToken, async (req: AuthRequest, res) => {
  const courseCode = req.params.code;

  try {
    const course = await prisma.course.findUnique({
      where: { code: courseCode },
      select: { id: true },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const questions = await prisma.question.findMany({
      where: { courseId: course.id },
      select: { id: true, type: true, topic: true },
    });

    const totalQuestions = questions.length;
    const totalTopics = new Set(questions.map((q) => q.topic)).size;
    const totalSubjective = questions.filter(
      (q) => q.type === "Subjective"
    ).length;
    const totalMcq = questions.filter((q) => q.type === "MCQ").length;
    const totalNumerical = questions.filter(
      (q) => q.type === "Numerical"
    ).length;

    res.json({
      courseId: course.id,
      totalQuestions,
      totalTopics,
      totalSubjective,
      totalMcq,
      totalNumerical,
    });
  } catch (err) {
    console.error("Error fetching course stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get all questions of a course
 */
router.get("/:code/questions", verifyToken, async (req: AuthRequest, res) => {
  const courseCode = req.params.code;

  try {
    const course = await prisma.course.findUnique({
      where: { code: courseCode },
      select: { id: true },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch all questions for this course
    const questions = await prisma.question.findMany({
      where: { courseId: course.id },
      select: {
        id: true,
        difficulty: true,
        topic: true,
        type: true,
        details: true,
      },
    });

    res.json(questions);
  } catch (err) {
    console.error("Error fetching course questions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 1️⃣ Get all question sets for a course WITH ONLY stats
router.get(
  "/:code/question-sets",
  verifyToken,
  async (req: AuthRequest, res) => {
    const courseCode = req.params.code;

    try {
      const course = await prisma.course.findUnique({
        where: { code: courseCode },
        select: { id: true },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Fetch all question sets for this course with their questions (only for stats)
      const questionSets = await prisma.questionSet.findMany({
        where: { courseId: course.id },
        select: {
          id: true,
          title: true,
          description: true,
          questions: {
            select: {
              question: { select: { type: true, topic: true } },
            },
          },
        },
      });

      // Format with stats only
      const formatted = questionSets.map((set) => {
        const qs = set.questions.map((q) => q.question);

        const totalQuestions = qs.length;
        const totalTopics = new Set(qs.map((q) => q.topic)).size;
        const totalSubjective = qs.filter(
          (q) => q.type === "Subjective"
        ).length;
        const totalMcq = qs.filter((q) => q.type === "MCQ").length;
        const totalNumerical = qs.filter((q) => q.type === "Numerical").length;

        return {
          id: set.id,
          title: set.title,
          description: set.description,
          stats: {
            totalQuestions,
            totalTopics,
            totalSubjective,
            totalMcq,
            totalNumerical,
          },
        };
      });

      res.json(formatted);
    } catch (err) {
      console.error("Error fetching course question sets:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// 2️⃣ Get questions for a specific question set by name
router.get(
  "/:code/question-sets/:setName/questions",
  verifyToken,
  async (req: AuthRequest, res) => {
    const { code, setName } = req.params;

    try {
      const course = await prisma.course.findUnique({
        where: { code },
        select: { id: true },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Find set by name inside this course
      const set = await prisma.questionSet.findFirst({
        where: { title: setName, courseId: course.id },
        select: {
          id: true,
          title: true,
          description: true,
          questions: {
            select: {
              orderInSet: true,
              marks: true,
              question: {
                select: {
                  id: true,
                  difficulty: true,
                  topic: true,
                  type: true,
                  details: true,
                },
              },
            },
          },
        },
      });

      if (!set) {
        return res.status(404).json({ error: "Question set not found" });
      }

      const formattedQuestions = set.questions.map((q) => ({
        id: q.question.id,
        difficulty: q.question.difficulty,
        topic: q.question.topic,
        type: q.question.type,
        details: q.question.details,
        orderInSet: q.orderInSet,
        marks: q.marks,
      }));

      res.json({
        id: set.id,
        title: set.title,
        description: set.description,
        questions: formattedQuestions,
      });
    } catch (err) {
      console.error("Error fetching question set questions:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
