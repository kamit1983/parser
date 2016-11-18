import {EventEmitter} from 'events';
let elasticsearch = require('elasticsearch');

class Indexer extends EventEmitter{
  private config: Options;
  private indexer: any;
  constructor() {
    super();
  }
  initializeIndexer(options: Options) {
    this.config = options;
    this.indexer = new elasticsearch.Client({
      host: this.config.host
    });
  }
  index(config: IndexerItem,html: any,doc: any) {
    let self = this;
    self.indexer.index({
      index: self.options.source[name].indexer.index,
      //type: self.options.source[name].indexer.type,
      body: {
        'url': html.url,
        'title': html.title,
        'doc': doc
      }
    }, function (error, response) {
      if(error) {
        self.emit('error',name,error);
        return;
      }
      self.emit('success',response);
    });
  }
}

interface Options{
  source: IndexerOptions[],
  host: string
}
interface IndexerOptions{
  topic: string,
  indexer: IndexerItem
}
interface IndexerItem{
  index: string,
  type: string,
  fields: any
}

export {Indexer, Options, IndexerOptions, IndexerItem};
