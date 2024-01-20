import bcrypt from "bcrypt";

class AuthService {
    private SALT_ROUNDS: number = 10;

    async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
        return hash;
    }

    async verifyPassword(password: string, hashPassword: string): Promise<boolean> {
        const isValidPassword = await bcrypt.compare(password, hashPassword);
        return isValidPassword;
    }
}

export default AuthService;
