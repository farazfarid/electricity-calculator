"use client";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

const Chat = () => {
  const messageInput = useRef<HTMLTextAreaElement | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<string>("gpt-4");

  const handleEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement> &
      React.FormEvent<HTMLFormElement>
  ) => {
    if (e.key === "Enter" && isLoading === false) {
      e.preventDefault();
      setIsLoading(true);
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = messageInput.current?.value;
    if (message !== undefined) {
      setHistory((prev) => [...prev, message]);
      messageInput.current!.value = "";
    }

    if (!message) {
      return;
    }

    const response = await fetch("/api/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        currentModel,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    setHistory((prev) => [...prev, message]);

    let currentResponse: string[] = [];
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      currentResponse = [...currentResponse, chunkValue];
      setHistory((prev) => [...prev.slice(0, -1), currentResponse.join("")]);
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    localStorage.removeItem("response");
    setHistory([]);
  };

  useEffect(() => {
    localStorage.setItem("response", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const storedResponse = localStorage.getItem("response");
    if (storedResponse) {
      setHistory(JSON.parse(storedResponse));
    }
  }, []);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentModel(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full mx-2 flex flex-col items-start gap-3 pt-6 last:mb-6 md:mx-auto md:max-w-3xl">
        {isLoading
          ? history.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-blue-600" : "bg-blue-900"
                  } p-3 rounded-lg`}
                >
                  <Markdown>{item}</Markdown>
                </div>
              );
            })
          : history
          ? history.map((item: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-blue-600" : "bg-blue-900"
                  } p-3 rounded-lg`}
                >
                  <Markdown>{item}</Markdown>
                </div>
              );
            })
          : null}
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-10 md:max-w-3xl dark:bg-white/40 bg-black/40 backdrop-blur-xl rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] mb-4"
      >
        <textarea
          name="Message"
          placeholder="Start chatting..."
          ref={messageInput}
          onKeyDown={handleEnter}
          className="w-full resize-none bg-transparent outline-none pt-4 pl-4 translate-y-1"
        />
        <button
          disabled={isLoading}
          type="submit"
          className="absolute top-[1.4rem] right-5 p-1 rounded-md text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            className="h-4 w-4 rotate-90"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
