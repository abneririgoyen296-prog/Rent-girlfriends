-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT'
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT,
    "hourlyRate" REAL NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" INTEGER NOT NULL,
    "companionId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_companionId_fkey" FOREIGN KEY ("companionId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");
