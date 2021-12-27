import { Schema, model } from 'mongoose';

export interface OpenedDM {
  channel: String,
  openedBy: String
}

const schema = new Schema<OpenedDM>({
  channel: { type: 'String', ref: 'Channel' },
  openedBy: { type: 'String', ref: 'User' }
});



const OpenedDMModel = model<OpenedDM>('OpenedDM', schema);


export default OpenedDMModel;