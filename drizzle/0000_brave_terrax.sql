CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"default_currency" varchar(10) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
