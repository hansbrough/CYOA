import React from 'react';
//= ==== Style ===== //

const Home = () => {
  return (
    <main>
      <h2>Overview</h2>
      <p>
        This "choose your own adventure" story is powered by the npmjs package <a href="https://www.npmjs.com/package/question-tree-core" target="_blank" rel="noreferrer">question-tree-core</a> which helps determine the story path.
      </p>
      <p>
        The story might be boring (I hope you don't think so...) but the point of this exercise was to demonstrate that the "question-tree-core" package could be used to power a "Choose Your Own Adventure" style narrative.
      </p>
      <p>
        Be careful in there!
      </p>
    </main>
  );
};

export default Home;
