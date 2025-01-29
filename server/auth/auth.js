import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../index.js";

const secret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

export const authMiddleware = expressjwt({
  algorithms: ["HS256"],
  credentialsRequired: false,
  secret,
});

export async function handleLogin(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  const validPassword = user
    ? await bcrypt.compare(password, user.password)
    : false;
  if (!user || !validPassword) {
    res.sendStatus(401);
  } else {
    const claims = { sub: user.id, email: user.email };
    const token = jwt.sign(claims, secret);
    res.json({ token });
  }
}
