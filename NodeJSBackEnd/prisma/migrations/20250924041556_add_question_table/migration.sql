-- CreateTable
CREATE TABLE "public"."Question" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
