let kafka = require('kafka-node');
let store = require('node-storage');
let storeInstance = new store('./store');
let cheerio = require('cheerio');
import {EventEmitter} from 'events';

class Parser extends EventEmitter {
  private kafkaConfig : KafkaConfig[] = [];
  private config: ParserConfig[];
  constructor() {
    super();
  }
  parse(config: ParserConfig[]){
    this.config = config;
    for(let item of config){
      let storeVal = 0;
      storeVal = item.offset;
      this.kafkaConfig.push({
          topic: item.topic,
          partition: item.partition,
          offset: storeVal
        });
        console.log("topic pushed1");
    }

    this.kafkaConfig.map(function(config){
      let self = this;
      let consumer = new kafka.Consumer(
        new kafka.client(), new Array(config),{autoCommit: true, fromOffset: true}
      );
      consumer.on('message', function(message){
        storeInstance.put(config.topic,message.offset);
        let html = JSON.parse(message.value);
        let $ = cheerio.load(html.doc);
        self.emit('message',config,$);
      });
      consumer.on('error',function(error) {
        self.emit('error',config.topic,error);
      });
      consumer.on('offsetOutOfRange',function(error) {
        self.emit('error',config.topic,`Offset out of range ${error}`);
      });
    });
    console.log("parser finished!!");
    return true;
  }
  parseHTML(config,$) {
    let self = this;
    let doc = {};
    // Object.keys(self.options.source[name].parser).map(function(key) {
    //   doc[key] = self.options.source[name].parser[key];
    //   if(self.options.source[name].parser[key].method === 'html') {
    //     doc[key] = $(self.options.source[name].parser[key].html).html() || "";
    //   }
    //   else if(self.options.source[name].parser[key].method === 'val') {
    //     doc[key] = $(self.options.source[name].parser[key].html).val() || "";
    //   }
    //   else if(self.options.source[name].parser[key].method.split("=").indexOf('attr') !== -1) {
    //     doc[key] = $(self.options.source[name].parser[key].html).attr(self.options.source[name].parser[key].method.split("=")[1]) || "";
    //   }
    //   else {
    //     doc = null;
    //   }
    // });
    return doc;
  }

}
interface KafkaConfig{
  topic: string;
  partition: number;
  offset: number;
}
interface ParserConfig{
  topic: string;
  partition: number;
  offset: number;
  readFromLastOffset: boolean;
}

export {Parser, ParserConfig};
