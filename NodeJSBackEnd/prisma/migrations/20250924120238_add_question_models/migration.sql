-- CreateTable
CREATE TABLE "public"."QuestionSet" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "QuestionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionSetQuestion" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "questionSetId" INTEGER NOT NULL,
    "orderInSet" INTEGER,
    "marks" INTEGER,

    CONSTRAINT "QuestionSetQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."QuestionSet" ADD CONSTRAINT "QuestionSet_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionSetQuestion" ADD CONSTRAINT "QuestionSetQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionSetQuestion" ADD CONSTRAINT "QuestionSetQuestion_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "public"."QuestionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
