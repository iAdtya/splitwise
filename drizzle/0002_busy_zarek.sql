CREATE TABLE IF NOT EXISTS "balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"balance_with_user_id" integer NOT NULL,
	"balance_amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "balances" ADD CONSTRAINT "balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "balances" ADD CONSTRAINT "balances_balance_with_user_id_users_id_fk" FOREIGN KEY ("balance_with_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
