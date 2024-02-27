import React, { useState } from 'react';

const Inputs = ({ onChange }) => {
  const [mainSubject, setMainSubject] = useState('');
  const [scene, setScene] = useState('');

  const handleMainSubjectChange = (event) => {
    const value = event.target.value;
    setMainSubject(value);
    if (onChange) {
      onChange(`${value}. ${scene}`);
    }
  };

  const handleSceneChange = (event) => {
    const value = event.target.value;
    setScene(value);
    if (onChange) {
      onChange(`${mainSubject}. ${value}`);
    }
  };

  return (
    <>
      <input type="hidden" value={mainSubject} />
      <input type="hidden" value={scene} />
      <input
        placeholder="Enter the main subject here"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        value={mainSubject}
        onChange={handleMainSubjectChange}
      />
      <input
        placeholder="Change the scene here, word by word"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        value={scene}
        onChange={handleSceneChange}
      />
    </>
  );
};

export default Inputs;
