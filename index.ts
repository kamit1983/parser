import {Parser, ParserConfig} from "./parser";
import {Indexer} from "./indexer";

let parser = new Parser();
let parseConfig: [ParserConfig] = [{
  topic: "USA Cigarattes",
  partition: 0,
  offset: 0,
  readFromLastOffset: false
}];
parser.parse(parseConfig);
