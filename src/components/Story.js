import React from 'react';
import GraphUI from './GraphUI';

const PathType = () => {

  const introText = "Once upon a time in a land far, far away...";
  return (
    <main>
      <GraphUI
        graph_path="/data/graph/index"
        question_set_path="/data/questions/index"
        intro_text={introText}
      />
    </main>
  )
};

export default PathType;
