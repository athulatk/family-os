import crypto from "node:crypto";

export function generateInvitationToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashInvitationToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}