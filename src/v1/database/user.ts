import database from "../../database/database";
import { DBUser } from "../interface/User";
import FlakeId from "@brecert/flakeid";
import bcrypt from "bcrypt";
import { randomLetterNumber } from "../utils/random";

const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000,
});

interface CreateUser {
  email: string;
  username: string;
  password: string;
}
type returnType = Promise<[any, string | null, number | null]>;
class UserDao {
  // Creates an account and then returns the id.
  public async createUser(details: CreateUser): returnType {
    const hashPassword = await bcrypt.hash(details.password, 10);
    const id = flake.gen().toString();
    try {
      const createdIds = await database<DBUser>("users")
        .insert({
          id,
          email: details.email,
          discriminator: randomLetterNumber(4),
          username: details.username,
          password: hashPassword,
          password_version: 0
        })
        .returning("id")
      return [createdIds[0], null, null];
    } catch (err: any) {
      if (err.code === "23505") {
        return [null, "Email already exists!", 403];
      }
      console.log(err);
      return [null, "Error inserting user into database.", 403];
    }
  }
  // Check if email and password are correct using bcrypt.
  public async authenticateUser(email: string, password: string): returnType {
    const user = await database<DBUser>("users")
      .where({ email })
      .select("password", "id")
      .first();
    if (!user) return [null, "Invalid Email.", 404];
    const verifyPassword = bcrypt.compare(password, user.password);
    if (!verifyPassword) return [null, "Invalid password.", 403];
    return [user.id, null, null];
  }
}

export default new UserDao();
