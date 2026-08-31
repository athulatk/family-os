import bcrypt from "bcrypt";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
}