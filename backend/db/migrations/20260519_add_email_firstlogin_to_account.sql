-- Add email and is_first_login to Account table
-- is_first_login = true khi manager tạo tài khoản cho hội viên lần đầu,
-- đặt về false sau khi hội viên tự đổi mật khẩu.

ALTER TABLE "Account"
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN NOT NULL DEFAULT false;
