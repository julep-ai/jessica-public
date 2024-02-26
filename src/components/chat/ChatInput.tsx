import React from "react";
import { useOpenAI } from "@/context/OpenAIProvider";
import { MdSend } from "react-icons/md";

type Props = {};

export default function ChatInput({}: Props) {
  const { addMessage, loading } = useOpenAI();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (loading) return;
    e.preventDefault();
    if (!input) return;
    addMessage(input, true, "user");
    setInput("");
  };

  React.useEffect(() => {
    const resize = () => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "40px";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    };

    resize();
  }, [input]);

  // Handle submitting with enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  return (
    <div className="fixed bottom-0 flex h-40 w-full ">
      <form
        className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center space-y-6 px-4 pb-10 md:w-[calc(100%-260px)]"
        onSubmit={handleSubmit}
      >
        <div className="relative flex w-full flex-row rounded border border-[#8D8D8D] bg-tertiary shadow-xl">
          <textarea
            ref={textAreaRef}
            className="max-h-[200px] w-full resize-none border-none bg-tertiary p-4 text-primary outline-none"
            onChange={handleChange}
            value={input}
            rows={1}
            autoFocus={true}
          />
          <button
            type="submit"
            className="rounded p-4 text-primary hover:bg-primary/50"
          >
            {loading ? (
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <MdSend />
            )}
          </button>
        </div>


        <div className="text-[#8D8D8D] text-xs lg:text-sm text-center">
          Cooked up in{" "}
          <a href="https://www.julep.ai/" target="_blank" className="underline">
            Julep AI's
          </a>{" "}
          kitchen, using the secret ingredient :{" "}
          <a
            href="https://www.julep.ai/samantha"
            target="_blank"
            className="underline"
          >
            Samantha-1 model
          </a>
          .
        </div>
      </form>
    </div>
  );
}
