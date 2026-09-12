-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vid" TEXT NOT NULL,
    "rating" TEXT NOT NULL DEFAULT 'AS1',
    "position" TEXT NOT NULL,
    "fromTime" DATETIME NOT NULL,
    "toTime" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Booking" ("createdAt", "fromTime", "id", "position", "toTime", "type", "updatedAt", "vid") SELECT "createdAt", "fromTime", "id", "position", "toTime", "type", "updatedAt", "vid" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_position_idx" ON "Booking"("position");
CREATE INDEX "Booking_vid_idx" ON "Booking"("vid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
