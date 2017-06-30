// src/components/Editor/Quote.js
import ContentTools from 'ContentTools';

class TimeTool extends ContentTools.Tool {
  ContentTools.ToolShelf.stow(@, 'quote')
  constructor() {
    super();
    this.label = 'Quote';
    this.icon  = 'subheading';
    this.tagName = 'quote'
  }
}

const makeQuote = (_super) => {
  __extends(Quote, _super);

  function Quote() {
    return Quote.__super__.constructor.apply(this, arguments);
  }

  ContentTools.ToolShelf.stow(Quote, 'quote');

  Quote.label = 'Quote';
  Quote.icon = 'subheading';
  Quote.tagName = 'quote';

  return Quote;
}
