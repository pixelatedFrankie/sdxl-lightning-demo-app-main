import React, { useState, useEffect } from 'react';

type Prompt = {
  id: number;
  text: string;
  isActive: boolean;
  isEditing: boolean;
};

const PromptBoard = ({ onInputChange }: { onInputChange: (value: string) => void }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    // Trigger the API call with the current active prompts whenever the prompts array changes
    const activePromptsText = prompts
      .filter(prompt => prompt.isActive)
      .map(prompt => prompt.text)
      .join(' ');
    onInputChange(activePromptsText);
  }, [prompts]); // Depend on prompts array to automatically update the API call on change

  const addPrompt = () => {
    setPrompts(currentPrompts => [
      ...currentPrompts,
      { id: nextId, text: `Prompt ${nextId + 1}`, isActive: false, isEditing: false },
    ]);
    setNextId(currentId => currentId + 1);
  };

  const togglePromptActive = (id: number) => {
    setPrompts(currentPrompts =>
      currentPrompts.map(prompt =>
        prompt.id === id ? { ...prompt, isActive: !prompt.isActive } : prompt
      ),
    );
  };

  const startEditing = (id: number) => {
    setPrompts(currentPrompts =>
      currentPrompts.map(prompt =>
        prompt.id === id ? { ...prompt, isEditing: true } : prompt
      ),
    );
  };

  const stopEditing = (id: number, newText: string) => {
    setPrompts(currentPrompts =>
      currentPrompts.map(prompt =>
        prompt.id === id ? { ...prompt, isEditing: false, text: newText } : prompt
      ),
    );
  };

  const deletePrompt = (id: number) => {
    setPrompts(currentPrompts =>
      currentPrompts.filter(prompt => prompt.id !== id),
    );
  };

  return (
    <div>
      <button onClick={addPrompt} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Prompt
      </button>
      {prompts.map((prompt, index) => (
        <div key={prompt.id} className="flex items-center space-x-2 my-2">
          {prompt.isEditing ? (
            <input
              autoFocus
              defaultValue={prompt.text}
              onBlur={(e) => stopEditing(prompt.id, e.target.value)}
              className="border-2 border-gray-200 rounded px-2 py-1 text-sm"
            />
          ) : (
            <>
              <button
                className={`px-4 py-2 rounded ${prompt.isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => togglePromptActive(prompt.id)}>
                {prompt.text}
              </button>
              <a href="#" onClick={(e) => {e.preventDefault(); startEditing(prompt.id);}} className="underline text-blue-500">Edit</a>
              <a href="#" onClick={(e) => {e.preventDefault(); deletePrompt(prompt.id);}} className="underline text-red-500">Delete</a>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default PromptBoard;
