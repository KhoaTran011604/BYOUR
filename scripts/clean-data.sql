-- ============================================
-- SUPABASE DATA CLEANER SCRIPT
-- ============================================
-- Run this script in Supabase SQL Editor
-- ⚠️ WARNING: This script will PERMANENTLY DELETE data!
-- ============================================

-- Temporarily disable foreign key checks (if needed)
-- SET session_replication_role = 'replica';

-- ============================================
-- OPTION 1: Delete ALL data from specific tables
-- Uncomment the lines you want to run
-- ============================================

-- TRUNCATE TABLE table_name RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE users RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE projects RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE posts RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE comments RESTART IDENTITY CASCADE;

-- ============================================
-- OPTION 2: Xóa data với điều kiện (WHERE)
-- ============================================

-- DELETE FROM table_name WHERE created_at < '2024-01-01';
-- DELETE FROM table_name WHERE user_id = 'uuid-here';
-- DELETE FROM table_name WHERE status = 'test';

-- ============================================
-- OPTION 3: Xóa tất cả data từ TẤT CẢ tables
-- ⚠️ RẤT NGUY HIỂM - Chỉ dùng cho môi trường dev
-- ============================================

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
        RAISE NOTICE 'Truncated table: %', r.tablename;
    END LOOP;
END $$;

-- ============================================
-- OPTION 4: Xóa data nhưng giữ lại schema
-- Reset sequences về 1
-- ============================================

-- TRUNCATE TABLE
--     table1,
--     table2,
--     table3
-- RESTART IDENTITY CASCADE;

-- ============================================
-- OPTION 5: Xem danh sách tất cả tables
-- ============================================

SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- OPTION 6: Đếm số records trong mỗi table
-- ============================================

-- SELECT
--     schemaname,
--     relname as table_name,
--     n_live_tup as row_count
-- FROM pg_stat_user_tables
-- WHERE schemaname = 'public'
-- ORDER BY n_live_tup DESC;

-- ============================================
-- Bật lại foreign key checks
-- ============================================
-- SET session_replication_role = 'origin';
