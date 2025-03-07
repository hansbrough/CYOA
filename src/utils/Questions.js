/*
* Singleton helper methods to ingest and get data from *question graph*.
*/
const Questions = function() {
  this.store = null;
  this.options = {};
  this.fetching = null;
  //
  this.digest = (resp) => {
    this.fetching = false;
    this.store = resp || resp.data;
    const {baseUrl} = this.options;
    //conditionally prepend media src w/base url.
    //e.g. based on env differences.
    if(baseUrl){
      for(const q in resp) {
        if(resp[q].media) {
          resp[q].media.forEach(function(m){
            m.src = baseUrl + m.src;
          })
        }
      }
    }
    return !!resp;
  };
  //
  this.fetch = (config_url) => {
    if(config_url && !this.fetching) {
      this.fetching = true;
      config_url = `${config_url}.json`;
      return fetch(config_url, {method:'get'})
      .then(resp => resp.json())
      .then(this.digest);
    }
  };
  /*
  * return which of a question's predecessors was first in a conditional branch.
  * an arg (question object) that is non-conditional is returned as a no-op.
  * useful for multi-node, conditional branches
  * ex. sequence of 'plantId_1' -> 'plantId_5'(cond) -> 'plantId_6'(cond)
  * will return 'plantId_5' question obj when method passed 'plantId_6' question obj
  */
  this.getFirstConditionalInPath = (question) => {
    let node = question;
    if(question.conditional) {
      const prevQuestion = this.getNodeById(question.previous);

      //prevent recursion after navigating back to a previous question node.
      if(prevQuestion?.previous === question.id) {
        return node;
      }

      if(prevQuestion.conditional) {
        node = this.getFirstConditionalInPath(prevQuestion);//continue recursive look back.
      } else {
        node = question;
      }
    }
    return node;
  }
  /*
  * return the full answer object given an answer id
  */
  this.getAnswerById = (question={}, labelId) => {
    const {labels=[]} = question;
    return labelId && labels && labels.find(item => item.qid === labelId);
  }
  //
  this.getNodeById = (id) => id && this.store && this.store[id];
  /*
  * Update the question set with changes.
  */
  this.update = (question) => this.store[question.id] = question;

  this.updateNodeById = (id, options={}) => id && Object.assign(this.store[id], options);
};

export default new Questions();
