SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
COMMENT ON SCHEMA "public" IS 'standard public schema';
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
SET default_tablespace = '';
SET default_table_access_method = "heap";
CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_email" "text" NOT NULL,
    "action" "text" NOT NULL,
    "table_name" "text",
    "record_id" "uuid",
    "details" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."audit_logs" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."certifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name_en" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "issuer_en" "text" NOT NULL,
    "issuer_ar" "text" NOT NULL,
    "issue_date" "date",
    "expiry_date" "date",
    "credential_id" "text",
    "credential_url" "text",
    "logo_url" "text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."certifications" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."contact_messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "subject" "text",
    "message" "text" NOT NULL,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."contact_messages" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."education" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "institution_en" "text" NOT NULL,
    "institution_ar" "text" NOT NULL,
    "degree_en" "text" NOT NULL,
    "degree_ar" "text" NOT NULL,
    "field_en" "text",
    "field_ar" "text",
    "description_en" "text",
    "description_ar" "text",
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "is_current" boolean DEFAULT false,
    "gpa" "text",
    "location_en" "text",
    "location_ar" "text",
    "logo_url" "text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."education" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."experience" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "company_en" "text" NOT NULL,
    "company_ar" "text" NOT NULL,
    "role_en" "text" NOT NULL,
    "role_ar" "text" NOT NULL,
    "description_en" "text",
    "description_ar" "text",
    "responsibilities_en" "text" [] DEFAULT '{}'::"text" [],
    "responsibilities_ar" "text" [] DEFAULT '{}'::"text" [],
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "is_current" boolean DEFAULT false,
    "location_en" "text",
    "location_ar" "text",
    "company_logo" "text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."experience" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name_en" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "title_en" "text" NOT NULL,
    "title_ar" "text" NOT NULL,
    "bio_en" "text",
    "bio_ar" "text",
    "email" "text",
    "phone" "text",
    "location_en" "text",
    "location_ar" "text",
    "github_url" "text",
    "linkedin_url" "text",
    "twitter_url" "text",
    "website_url" "text",
    "avatar_url" "text",
    "resume_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."profiles" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title_en" "text" NOT NULL,
    "title_ar" "text" NOT NULL,
    "description_en" "text",
    "description_ar" "text",
    "long_description_en" "text",
    "long_description_ar" "text",
    "tech_stack" "text" [] DEFAULT '{}'::"text" [],
    "github_url" "text",
    "live_url" "text",
    "image_url" "text",
    "featured" boolean DEFAULT false,
    "order_index" integer DEFAULT 0,
    "status" "text" DEFAULT 'completed'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "projects_status_check" CHECK (
        (
            "status" = ANY (
                ARRAY ['completed'::"text", 'in_progress'::"text", 'archived'::"text"]
            )
        )
    )
);
ALTER TABLE "public"."projects" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."skills" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name_en" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "category" "text" NOT NULL,
    "proficiency" integer DEFAULT 80,
    "icon" "text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "skills_category_check" CHECK (
        (
            "category" = ANY (
                ARRAY ['languages'::"text", 'frameworks'::"text", 'databases'::"text", 'tools'::"text", 'cloud'::"text", 'other'::"text"]
            )
        )
    ),
    CONSTRAINT "skills_proficiency_check" CHECK (
        (
            ("proficiency" >= 0)
            AND ("proficiency" <= 100)
        )
    )
);
CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name_en" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "provider_en" "text" NOT NULL,
    "provider_ar" "text" NOT NULL,
    "completion_date" "date",
    "course_url" "text",
    "certificate_url" "text",
    "description_en" "text",
    "description_ar" "text",
    "logo_url" "text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."courses" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."visitors" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "ip" "text",
    "country" "text",
    "city" "text",
    "browser" "text",
    "os" "text",
    "url" "text",
    "referrer" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."visitors" OWNER TO "postgres";
ALTER TABLE ONLY "public"."skills"
ALTER TABLE ONLY "public"."audit_logs"
ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."certifications"
ADD CONSTRAINT "certifications_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."contact_messages"
ADD CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."education"
ADD CONSTRAINT "education_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."experience"
ADD CONSTRAINT "experience_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."profiles"
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."projects"
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."skills"
ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."courses"
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."visitors"
ADD CONSTRAINT "visitors_pkey" PRIMARY KEY ("id");
CREATE INDEX "idx_education_order" ON "public"."education" USING "btree" ("order_index");
CREATE INDEX "idx_experience_order" ON "public"."experience" USING "btree" ("order_index");
CREATE INDEX "idx_messages_read" ON "public"."contact_messages" USING "btree" ("is_read");
CREATE INDEX "idx_projects_featured" ON "public"."projects" USING "btree" ("featured");
CREATE INDEX "idx_projects_order" ON "public"."projects" USING "btree" ("order_index");
CREATE INDEX "idx_skills_category" ON "public"."skills" USING "btree" ("category");
CREATE INDEX "idx_courses_order" ON "public"."courses" USING "btree" ("order_index");
CREATE POLICY "Deny all public" ON "public"."audit_logs" USING (false);
CREATE POLICY "Public insert messages" ON "public"."contact_messages" FOR
INSERT WITH CHECK (true);
CREATE POLICY "Public read certifications" ON "public"."certifications" FOR
SELECT USING (true);
CREATE POLICY "Public read education" ON "public"."education" FOR
SELECT USING (true);
CREATE POLICY "Public read experience" ON "public"."experience" FOR
SELECT USING (true);
CREATE POLICY "Public read profiles" ON "public"."profiles" FOR
SELECT USING (true);
CREATE POLICY "Public read projects" ON "public"."projects" FOR
SELECT USING (true);
CREATE POLICY "Public read skills" ON "public"."skills" FOR
SELECT USING (true);
CREATE POLICY "Public read courses" ON "public"."courses" FOR
SELECT USING (true);
CREATE POLICY "Public insert visitors" ON "public"."visitors" FOR
INSERT WITH CHECK (true);
CREATE POLICY "Service read visitors" ON "public"."visitors" FOR
SELECT USING (true);
ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."certifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."education" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."experience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."visitors" ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";
GRANT ALL ON TABLE "public"."certifications" TO "anon";
GRANT ALL ON TABLE "public"."certifications" TO "authenticated";
GRANT ALL ON TABLE "public"."certifications" TO "service_role";
GRANT ALL ON TABLE "public"."contact_messages" TO "anon";
GRANT ALL ON TABLE "public"."contact_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_messages" TO "service_role";
GRANT ALL ON TABLE "public"."education" TO "anon";
GRANT ALL ON TABLE "public"."education" TO "authenticated";
GRANT ALL ON TABLE "public"."education" TO "service_role";
GRANT ALL ON TABLE "public"."experience" TO "anon";
GRANT ALL ON TABLE "public"."experience" TO "authenticated";
GRANT ALL ON TABLE "public"."experience" TO "service_role";
GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";
GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";
GRANT ALL ON TABLE "public"."skills" TO "service_role";
GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";
GRANT ALL ON TABLE "public"."visitors" TO "anon";
GRANT ALL ON TABLE "public"."visitors" TO "authenticated";
GRANT ALL ON TABLE "public"."visitors" TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "service_role";