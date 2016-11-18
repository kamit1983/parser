import {Parser, ParserConfig, ParserItem} from "./parser";
import {Indexer, Options, IndexerOptions, IndexerItem} from "./indexer";
var R = require('ramda');
let parser = new Parser();
let indexer = new Indexer();
let parseConfig: ParserConfig[] = [{
  topic: "USA-Cigarattes",
  partition: 0,
  offset: 0,
  readFromLastOffset: false,
  parsers: [{
    name: "test",
    selector: "a",
    method: "html"
  }],

}];

let indexerConfig: Options= {
  source:[{
    topic: "USA-Cigarattes",
    indexer: {
      index: "name",
      type: "na",
      fields: {doc: 'doc'}
    }
  }],
  host: "localhost:9200"
};

parser.parse(parseConfig);
indexer.initializeIndexer(indexerConfig);

parser.on('message',function(config, html,$) {
  let parseData = parser.parseHTML(config,$);
  let indexerConfigItem = R.find(R.propEq('topic', config.topic))(indexerConfig.source);
  indexer.index(indexerConfigItem,html,parseData);
});

parser.on('error',function(topic,error) {
  console.log(topic);
  console.log(error);
});

parser.on('offsetOutOfRange',function(error) {
  console.log(error);
});

indexer.on('error',function(error) {
  console.log(error);
});

indexer.on('success',function() {
  console.log("indexed");
});
