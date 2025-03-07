/*
* Simple example of using the 'question-tree-core' package in React.
*/
import React, { useEffect, useState } from 'react';
//import DecisionTree from 'question-tree-core';
import DecisionTree from "../utils/DecisionTree";// or debug w/the unpackaged files
import ReactMarkdown from 'react-markdown';

const GraphUI = ({graph_path, question_set_path, intro_text='Introduction...',intro_img_src}) => {
  const [decisionTreeInitializing, setDecisionTreeInitializing] = useState();
  const [decisionTreeInitialized, setDecisionTreeInitialized] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentAnswerId, setCurrentAnswerId] = useState();
  const [currentNarrative, setCurrentNarrative] = useState();
  //track user responses in order to provide feedback during summary module.
  //const [correctResponses, setCorrectResponses] = useState([]);
  //const [inCorrectResponses, setInCorrectResponses] = useState([]);
  const [isFinalModule, setIsFinalModule] = useState();

  // get the module and question graph files.
  useEffect(() => {
    if(!decisionTreeInitializing) {
      const p = DecisionTree.fetch({graph_path, question_set_path});
      setDecisionTreeInitializing(true);
      p && p.then(setDecisionTreeInitialized);
    }
  },[graph_path, question_set_path, decisionTreeInitializing]);

  // optionally do something upon successful fetch of graph files.
  useEffect(() => {
    if(decisionTreeInitialized) {
      console.log("GraphUI question-tree graph files fetched.");
    }
  },[decisionTreeInitialized]);

  // is the final (summary) module currently being displayed.
  useEffect(() => {
    if(currentQuestion && currentQuestion.module === 'module_final') {
      setIsFinalModule(true);
    } else {
      setIsFinalModule(false);
    }
  },[currentQuestion]);

  // 1. fetch associated text file(s) 2. get text from file(s)
  // above requires 2 promise.all() calls.
  useEffect(() => {
    //console.log("currentQuestion:",currentQuestion)
    const {media} = currentQuestion || {};
    if(media) {
      Promise.all(
        media.filter(item => item.type === 'text')
        .map(path => fetch(path.src, {method:'get'}))
      )
      .then(resp => Promise.all(resp.map(r => r.text())))
      .then(result => setCurrentNarrative(result.join('\n')))
    }
  },[currentQuestion]);

  const displayNextBtn = !currentQuestion || (currentQuestion && currentAnswerId );//&& !currentQuestion.last

  // App logic keeps track of user answers and how the results are displayed
  // substitute your own app logic for the example below.
  // const updateResponses = (responses, setResponses, siblingResponses) => {
  //   if(!responses.some(item => item.id === currentQuestion.id)) {
  //     const responsesCopy = [...responses];
  //     const userResponse = Object.assign({}, currentQuestion, {answerId: currentAnswerId});
  //     responsesCopy.push(userResponse);
  //     setResponses(responsesCopy)
  //   }
  //   //if previously answered - remove from other responses bucket
  //   const idx = siblingResponses.findIndex(item => item.id === currentQuestion.id);
  //   if(idx >= 0) {
  //     siblingResponses.splice(idx, 1);
  //   }
  // }

  // event handler examples
  const handleNextClick = () => {
    // 1. keep track of correctness of user answers.
    // if(currentAnswerId) {
    //   if(currentAnswerId === (currentQuestion && currentQuestion.actual)) {
    //     updateResponses(correctResponses, setCorrectResponses, inCorrectResponses)
    //   } else {
    //     updateResponses(inCorrectResponses, setInCorrectResponses, correctResponses)
    //   }
    // }
    setCurrentNarrative();
    // 2. get the next question based on the users last response
    setCurrentQuestion(DecisionTree.next({ labelIdx: currentAnswerId }));
    // 3. reset
    setCurrentAnswerId()
  };
  //const handlePrevClick = () => setCurrentQuestion(DecisionTree.prev());
  const handleInputChange = e => setCurrentAnswerId(e.target.id)

  return (
    <div className="graph-ui">
      {!currentQuestion &&
        <div>
          <img key="introduction_image" src={intro_img_src} alt="bookcover" style={{width:"100%"}} />
          <h4 style={{padding:".5rem"}}>{intro_text}</h4>
        </div>
      }
      {currentQuestion &&
        <div style={{padding:".5rem"}}>
          <p><em>Question ID:</em> "{currentQuestion.id}"</p>
          <p><em>Module ID:</em> "{currentQuestion.module}"</p>
          <p><em>Graph Position:</em> {currentQuestion.position.current} of {currentQuestion.position.total} nodes</p>
          <hr></hr>
          <h2>{currentQuestion.title}</h2>
          {currentQuestion.media &&
            currentQuestion.media.map(item => item.type==='image' &&
              <img key={currentQuestion.id} src={item.src} alt="" style={{width:"100%"}} />
            )
          }
          {currentNarrative && (
            <ReactMarkdown className="narrative-container" source={currentNarrative} />
          )}
          {currentQuestion.labels
            && currentQuestion.labels.map(
              item => (
                <label key={item.qid}>
                  <input type="radio" id={item.qid} name="quiz-example" onChange={handleInputChange}/>
                  {item.title}
                </label>
              )
          )}

          {isFinalModule &&
            <div style={{marginBottom:"1rem",marginTop:"1rem"}}></div>
          }
        </div>
      }
      {/* <button onClick={handlePrevClick} disabled={!DecisionTree.hasPreviousQuestion()}>Prev</button> */}
      <button onClick={handleNextClick} disabled={!displayNextBtn}>Next</button>
    </div>
  );
};

export default GraphUI;
