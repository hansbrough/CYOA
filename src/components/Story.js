import React from 'react';
import GraphUI from './GraphUI';

const PathType = () => {

  const introText = "Some plants grow in the dark for a reason…";
  const intro_img_src = "/images/bookcover_art.webp";
  
  return (
    <main>
      <GraphUI
        graph_path="/data/graph/index"
        question_set_path="/data/questions/index"
        intro_text={introText}
        intro_img_src={intro_img_src}
      />
    </main>
  )
};

export default PathType;
