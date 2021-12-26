import { Schema, model } from 'mongoose';

export interface Friend {
  requester: String;
  recipient: String;
  status: number; // incoming | outgoing | friends
  createdAt: number;
}

const schema = new Schema<Friend>({
  requester: { type: 'String', ref: 'User' },
  recipient: { type: 'String', ref: 'User' },
  status: {required: true, type: Number},

  createdAt: {type: Number,default: Date.now()}
});



const FriendModel = model<Friend>('Friend', schema);


export default FriendModel;