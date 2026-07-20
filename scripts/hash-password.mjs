/**
 * Chạy: node scripts/hash-password.mjs
 * Script sẽ hỏi mật khẩu bạn muốn dùng và in ra bcrypt hash.
 * Copy hash đó vào ADMIN_PASSWORD_HASH trong file .env
 */
import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Nhập mật khẩu admin mới: ", async (password) => {
  if (!password || password.length < 8) {
    console.error("❌ Mật khẩu phải có ít nhất 8 ký tự.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  console.log("\n✅ Bcrypt hash của bạn (dán vào ADMIN_PASSWORD_HASH trong .env):\n");
  console.log(hash);
  rl.close();
});
