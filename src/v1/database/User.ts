import { User } from "../interface/User";
import UserModel from "../../models/UserModel";
import FlakeId from "@brecert/flakeid";
import bcrypt from "bcrypt";
import { randomLetterNumber } from "../utils/random";
import handlePostgresError from "./errorHandler";
import { FriendshipStatus } from "./Friend";
import FriendModel from "../../models/FriendModel";

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

export enum Presence {
  OFFLINE = 0,
  ONLINE = 1,
  AWAY = 2,
  BUSY = 3,
}


// Creates an account and then returns the id.
export async function createUser(details: CreateUser) {
  const hashPassword = await bcrypt.hash(details.password, 10);
  const id = flake.gen().toString();

  return UserModel.create({
    id: id,
    email: details.email,
    username: details.username,
    tag: randomLetterNumber(4),
    password: hashPassword,
    passwordVersion: 0,
    presence: Presence.ONLINE
  }).then(user => user.id)
  .catch(err => {
    if (err.code === "P2002") {
      throw { statusCode: 400, message: "email already exists" };
    }
    if (handlePostgresError(err)) {
      throw handlePostgresError(err)
    } else{
      console.log(err)
      throw { statusCode: 500, message: "internal server error" };
    }
  })

}

export async function getUser(id: string) {
  return UserModel.findOne({id}, {_id: 0, id: 1, username: 1, tag: 1})
}
export async function getUserAll(id: string) {
  return UserModel.findOne({id})
}
export async function getUserByTag(username: string, tag: string) {
  return UserModel.findOne({username, tag}, {_id: 0, id: 1, username: 1, tag: 1})
}

export async function authenticateUser(email: string, password: string) {
  return UserModel.findOne({email}).select("username tag password id passwordVersion").then( async user => {
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

export async function updatePresence(id: string, presence: Presence) {
  return UserModel.updateOne({id}, {$set: {presence}})
}

export async function getFriendAndGuildIds(userId: string) {
  const friends = await FriendModel.find({requester: userId, status: FriendshipStatus.Friends}).select("recipient")
  

  const friendIds = friends.map(friend => friend.recipient) as string[];
  // TODO: get guild ids
  const guildIds: string[] = [];
  return [...friendIds, ...guildIds];
}