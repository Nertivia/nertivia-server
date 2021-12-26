import { Schema, model } from 'mongoose';

export interface BlockedUser {
  blocker: String,
  blocked: String,
  createdAt: number;
}

const schema = new Schema<BlockedUser>({
  blocker: { type: 'String', ref: 'User' },
  blocked: { type: 'String', ref: 'User' },

  createdAt: {type: Number,default: Date.now()}
});



const BlockedUserModel = model<BlockedUser>('BlockedUser', schema);


export default BlockedUserModel;