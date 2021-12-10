import database from "../../common/database";
import { User } from "../interface/User";
import FlakeId from "@brecert/flakeid";
import bcrypt from "bcrypt";
import { randomLetterNumber } from "../utils/random";
import handlePostgresError from "./errorHandler";
import prisma from "../../common/database";

const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000,
});

export interface ReturnError {
  statusCode: number;
  message: string;
}

interface CreateUser {
  email: string;
  username: string;
  password: string;
}


// Creates an account and then returns the id.
export async function createUser(details: CreateUser) {
  const hashPassword = await bcrypt.hash(details.password, 10);
  const id = flake.gen().toString();

  return await prisma.user.create({
    data: {
      id,
      email: details.email,
      username: details.username,
      discriminator: randomLetterNumber(4),
      password: hashPassword,
      passwordVersion: 0
    },
    select: { id: true }
  }).then(user => user.id)
  .catch(err => {
    if (err.code === "P2002") {
      throw { statusCode: 400, message: "email already exists" };
    }
    if (handlePostgresError(err)) {
      throw handlePostgresError(err)
    } else{
      throw { statusCode: 500, message: "internal server error" };
    }
  })

}

export async function getUser(id: string) {
  return prisma.user.findFirst(
    {
      where: {id},
      select: {id: true, username: true, discriminator: true}
    }).catch(err => {
      throw {
        statusCode: 500,
        message: "Something went wrong when getting from the database.",
        ...err
      };
    });
}
export async function getUserAll(id: string) {
  return prisma.user.findFirst({where: {id: id}}).catch(err => {
    throw {
      statusCode: 500,
      message: "Something went wrong when inserting to the database.",
      ...err
    };
  });
}
export async function getUserByTag(username: string, discriminator: string) {
  return prisma.user.findFirst(
    {
      where: {username, discriminator},
      select: {id: true, username: true, discriminator: true}
    }).catch(err => {
      throw {
        statusCode: 500,
        message: "Something went wrong when getting from the database.",
        ...err
      };
    });
}

export async function authenticateUser(email: string, password: string) {

  return prisma.user.findFirst(
    {
      where: {email},
      select: {username: true, discriminator: true, password: true, id: true, passwordVersion: true}
    })
    .then(async user => {
      if (!user) {
        throw { statusCode: 401, message: "Invalid email or password!" };
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        throw { statusCode: 401, message: "Invalid email or password!" };
      }
      return user;
    })    
    .catch(err => {
      throw {
        statusCode: 500,
        message: "Something went wrong when getting from the database.",
        ...err
      };
    });
}
