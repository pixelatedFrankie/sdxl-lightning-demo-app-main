// Use client-side rendering for this Next.js component
"use client";

// Import necessary dependencies
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input"; // Ensure this path matches your project structure
import { ModelIcon } from "@/components/icons/model-icon"; // Ensure this path matches your project structure, or remove if unused
import Link from "next/link"; // Remove if unused to keep the component clean
import PromptBoard from "@/components/ui/prompt-board"; // Ensure this path matches your project structure
import * as fal from "@fal-ai/serverless-client"; // Ensure this package is installed and the path is correct

// Default prompt setup
const DEFAULT_PROMPT = "A cinematic shot of a baby raccoon wearing an intricate Italian priest robe";

function randomSeed() {
  return Math.floor(Math.random() * 10000000).toFixed(0);
}

fal.config({
  proxyUrl: "/api/proxy", // Ensure this matches your actual proxy configuration
});

const INPUT_DEFAULTS = {
  _force_msgpack: new Uint8Array([]),
  enable_safety_checker: true,
  image_size: "square_hd",
  sync_mode: true,
  num_images: 1,
  num_inference_steps: "2",
};

export default function Lightning() {
  const [image, setImage] = useState<null | string>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [seed, setSeed] = useState<string>(randomSeed());
  const [inferenceTime, setInferenceTime] = useState<number>(NaN);
  const [activePrompts, setActivePrompts] = useState<string>("");

  const connection = fal.realtime.connect("fal-ai/fast-lightning-sdxl", {
    connectionKey: "lightning-sdxl",
    throttleInterval: 64,
    onResult: (result) => {
      const blob = new Blob([result.images[0].content], { type: "image/jpeg" });
      setImage(URL.createObjectURL(blob));
      setInferenceTime(result.timings.inference);
    },
  });

  const timer = useRef<any | undefined>(undefined);

  const handleOnChange = async (newPrompt: string, additionalPrompts: string = "") => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setPrompt(newPrompt);
    const combinedPrompt = `${newPrompt} ${additionalPrompts}`.trim();
    const input = {
      ...INPUT_DEFAULTS,
      prompt: combinedPrompt,
      seed: seed ? Number(seed) : Number(randomSeed()),
    };
    connection.send(input);
    timer.current = setTimeout(() => {
      connection.send({ ...input, num_inference_steps: "4" });
    }, 500);
  };

  const updateActivePrompts = (prompts: string) => {
    setActivePrompts(prompts);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.cookie = "fal-app=true; path=/; samesite=strict; secure;";
    }
    connection.send({
      ...INPUT_DEFAULTS,
      num_inference_steps: "4",
      prompt: `${prompt} ${activePrompts}`.trim(),
      seed: seed ? Number(seed) : Number(randomSeed()),
    });
  }, []);

  useEffect(() => {
    if (activePrompts) {
      handleOnChange(prompt, activePrompts);
    }
  }, [activePrompts, prompt]);

  return (
    <main>
      <div className="container py-4 px-1.5 space-y-4 lg:space-y-8 mx-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
            <div className="flex-1 space-y-1">
              <label>Prompt</label>
              <Input
                onChange={(e) => {
                  handleOnChange(e.target.value, activePrompts);
                }}
                className="font-light w-full"
                placeholder="Type something..."
                value={prompt}
              />
            </div>
            <div className="space-y-1">
              <label>Seed</label>
              <Input
                onChange={(e) => {
                  setSeed(e.target.value);
                  handleOnChange(prompt, activePrompts);
                }}
                className="font-light w-full"
                placeholder="random"
                type="number"
                value={seed}
              />
            </div>
          </div>
        </div>
        <PromptBoard onInputChange={updateActivePrompts} />
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0">
          <div className="flex-1 flex justify-center">
            {image && <img src={image} alt="Generated" className="max-h-[512px] w-auto" />}
          </div>
        </div>
      </div>
    </main>
  );
}
