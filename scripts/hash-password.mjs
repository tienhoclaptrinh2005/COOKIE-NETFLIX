import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Provide a password with at least 12 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

console.log("For a local .env or .env.local file:");
console.log(hash.replaceAll("$", "\\$"));
console.log("\nFor the Vercel Environment Variables dashboard:");
console.log(hash);
