/*
  Warnings:

  - Added the required column `message` to the `ExecutionLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExecutionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "LogLevel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timeStamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionPhaseId" TEXT NOT NULL,
    CONSTRAINT "ExecutionLog_executionPhaseId_fkey" FOREIGN KEY ("executionPhaseId") REFERENCES "ExecutionPhase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ExecutionLog" ("LogLevel", "executionPhaseId", "id", "timeStamp") SELECT "LogLevel", "executionPhaseId", "id", "timeStamp" FROM "ExecutionLog";
DROP TABLE "ExecutionLog";
ALTER TABLE "new_ExecutionLog" RENAME TO "ExecutionLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
