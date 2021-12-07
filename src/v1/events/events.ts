import { ClientEvent } from "../constants/ClientEvent";
import authenticate from "./authenticate";

export default {
  [ClientEvent.AUTHENTICATE]: authenticate 
}