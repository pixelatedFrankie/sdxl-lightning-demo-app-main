import React, { useState } from 'react';

// Define a type for the prompt to improve type-checking.
type Prompt = {
  id: number;
  text: string;
  isActive: boolean;
  isEditing: boolean;
};

const PromptBoard = ({ onInputChange }: { onInputChange: (value: string) => void }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const addPrompt = () => {
    const newPrompt: Prompt = {
      id: prompts.length,
      text: `Prompt ${prompts.length + 1}`,
      isActive: false,
      isEditing: false,
    };
    setPrompts([...prompts, newPrompt]);
  };

  const togglePromptActive = (id: number) => {
    const updatedPrompts = prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, isActive: !prompt.isActive } : prompt
    );
    setPrompts(updatedPrompts);
    updateActivePromptsInput(updatedPrompts);
  };

  const startEditing = (id: number) => {
    const updatedPrompts = prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, isEditing: true } : prompt
    );
    setPrompts(updatedPrompts);
  };

  const stopEditing = (id: number, newText: string) => {
    const updatedPrompts = prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, isEditing: false, text: newText } : prompt
    );
    setPrompts(updatedPrompts);
    updateActivePromptsInput(updatedPrompts);
  };

  const updateActivePromptsInput = (updatedPrompts: Prompt[]) => {
    const activePromptsText = updatedPrompts
      .filter((prompt) => prompt.isActive)
      .map((prompt) => prompt.text)
      .join(' ');
    onInputChange(activePromptsText);
  };

  return (
    <div>
      <button onClick={addPrompt}>Add Prompt</button>
      <div>
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="flex items-center space-x-2 my-2">
            {prompt.isEditing ? (
              <input
                type="text"
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptBoard;
