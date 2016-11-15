var kafka = require('kafka-node');
class Parser {
  private kafkaConfig : KafkaConfig[] = [];
  constructor() {
    //super();
  }
  parse(config: ParserConfig[]){
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
    for(let config of this.kafkaConfig){
      console.log(config.topic);
    }
    console.log("parser finished!!");
    return true;
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
