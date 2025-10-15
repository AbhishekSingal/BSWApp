-- CreateTable
CREATE TABLE "public"."Course" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "contentVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
