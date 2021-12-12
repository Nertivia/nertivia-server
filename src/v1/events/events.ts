import { ClientEvent } from "../constants/ClientEvent";
import authenticate from "./authenticate";
import disconnect from "./disconnect";

export default {
  [ClientEvent.AUTHENTICATE]: authenticate,
  // socket io events
  disconnect 
}