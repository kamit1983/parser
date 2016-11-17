import {Parser, ParserConfig, ParserItem} from "./parser";
import {Indexer} from "./indexer";

let parser = new Parser();
let parseConfig: ParserConfig[] = [{
  topic: "USA-Cigarattes",
  partition: 0,
  offset: 0,
  readFromLastOffset: false,
  parsers: [{
    name: "test",
    selector: "a",
    method: "html"
  }]
}];
parser.parse(parseConfig);


parser.on('message',function(config,$) {
  let parseData = parser.parseHTML(config,$);
  //indexer.index(topic,html,parseData);
});

parser.on('error',function(topic,error) {
  console.log(topic);
  console.log(error);
});

parser.on('offsetOutOfRange',function(error) {
  console.log(error);
});

// indexer.on('error',function(error) {
//   console.log(error);
// });
//
// indexer.on('success',function() {
//   console.log("indexed");
// });
