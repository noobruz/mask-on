-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT
);

-- CreateTable
CREATE TABLE "chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender_id" TEXT NOT NULL,
    "reciever_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attachment_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    CONSTRAINT "chats_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chats_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chats_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chats_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "chats" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL
);
