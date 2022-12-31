import { Subjects } from "../subjects";
import {RedisClientType} from 'redis'

interface Message{
  channel: Subjects;
  data:any
}

export abstract class Publisher<T extends Message>{

  abstract channel: T['channel'];
 
  protected client: RedisClientType;

  constructor(redis_client: RedisClientType){
     this.client = redis_client;
  }

  async publish(data:T['data']){
    console.log(data, "publisher");
    
     await this.client.publish(this.channel, JSON.stringify(data));
  }
}