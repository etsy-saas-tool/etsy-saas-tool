"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "bot" | "user";
  text: string;
};

type FaqEntry = {
  keywords: string[];
  question: string;
  answer: string;
};

// Plain keyword-matched FAQ answers - no AI call involved, so this never
// touches the Gemini API or its daily free-tier limit, and it works the
// same at 3am as it does at 3pm. Keep this list updated as new questions
// come up from real users.
const FAQS: FaqEntry[] = [
  {
    keywords: ["credit", "credits", "how many credit", "kitne credit"],
    question: "How do credits work?",
    answer:
      "Every plan comes with AI credits, and each listing you generate uses 1 credit. Free: 5 credits. Starter ($9/mo): 100 credits. Pro ($29/mo): 500 credits + keyword research.",
  },
  {
    keywords: ["0 credit", "no credit", "ran out", "credits left", "out of credit", "remaining credit"],
    question: "I'm out of credits, what do I do?",
    answer:
      "Once your credits run out, you'll need to upgrade to get more. Visit the Pricing page anytime to see the Starter and Pro plans.",
  },
  {
    keywords: ["how to use", "how do i generate", "make a listing", "generate listing", "how does the generator work"],
    question: "How do I generate a listing?",
    answer:
      "Go to the Generator page, fill in your product name, category, style and target audience, then click “Generate My Etsy Listing”. You'll get a title, 13 SEO tags, description, pricing suggestion and more.",
  },
  {
    keywords: ["keyword research", "keyword tool", "seo research"],
    question: "What is Keyword Research?",
    answer:
      "Keyword Research is a Pro-plan feature. Enter any keyword and get an SEO score, competition level, best Etsy tags, and long-tail keyword ideas.",
  },
  {
    keywords: ["upgrade", "price", "pricing", "plan", "subscribe", "cost", "how much"],
    question: "How do I upgrade my plan?",
    answer:
      "Open the Pricing page anytime. Starter is $9/month (100 credits) and Pro is $29/month (500 credits + keyword research), both billed securely through Paddle.",
  },
  {
    keywords: ["cancel", "unsubscribe", "stop subscription", "stop billing"],
    question: "How do I cancel my subscription?",
    answer:
      "Go to your Billing page and cancel anytime. You'll keep access until the end of your current paid period and won't be charged again after that.",
  },
  {
    keywords: ["refund", "money back", "guarantee"],
    question: "What's your refund policy?",
    answer:
      "First-time subscribers get a 7-day, no-questions-asked money-back guarantee. After 7 days, payments (including unused credits) aren't refundable — see the Refund Policy page for details.",
  },
  {
    keywords: ["forgot password", "reset password", "can't login", "cant login", "login issue", "password"],
    question: "I forgot my password",
    answer:
      "Click “Forgot password?” on the Login page, enter your email, and we'll send you a reset link. Don't forget to check your spam folder.",
  },
  {
    keywords: ["error", "not working", "failed", "overloaded", "quota", "ai error", "server busy"],
    question: "I'm seeing an AI error",
    answer:
      "That usually means our AI provider is briefly busy or has hit today's usage limit — it's not an issue with your account or credits. Please wait a few minutes and try again.",
  },
  {
    keywords: ["payment", "billing issue", "charged", "card declined", "invoice"],
    question: "I have a billing or payment issue",
    answer: "Please email us with the email address on your account and we'll sort it out quickly.",
  },
  {
    keywords: ["what is etsyai", "what is this", "about this tool", "what does this do"],
    question: "What is EtsyAI?",
    answer:
      "EtsyAI is an AI-powered tool that generates optimized Etsy listing titles, SEO tags, descriptions and pricing suggestions — built to help you save time and sell more.",
  },
  {
    keywords: ["save listing", "my listings", "saved listings"],
    question: "How do I save a listing?",
    answer:
      "After generating a listing, click “Save Listing”. You can view everything you've saved anytime under “My Listings” in your dashboard.",
  },
  {
    keywords: ["privacy", "data safe", "secure", "gdpr"],
    question: "Is my data safe?",
    answer: "Yes. See the Privacy Policy page for full details on how your data is collected and used.",
  },
  {
    keywords: ["human", "real person", "talk to someone", "support team", "contact"],
    question: "Can I talk to a real person?",
    answer: "Of course — email 121472muhammadarslan@gmail.com anytime and we'll reply personally as soon as we can.",
  },
];

const SUGGESTED = [
  "How do credits work?",
  "How do I upgrade my plan?",
  "What's your refund policy?",
  "I forgot my password",
];

const FALLBACK_ANSWER =
  "I'm not totally sure about that one yet. Please email 121472muhammadarslan@gmail.com and a real person will help you directly.";

function findAnswer(input: string): string {
  const text = input.toLowerCase();

  let bestScore = 0;
  let bestAnswer = "";

  for (const faq of FAQS) {
    let score = 0;

    for (const keyword of faq.keywords) {
      if (text.includes(keyword)) {
        score += keyword.split(" ").length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = faq.answer;
    }
  }

  return bestScore > 0 ? bestAnswer : FALLBACK_ANSWER;
}

export default function SupportChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! 👋 I'm the EtsyAI support bot, here 24/7. Ask me anything about credits, pricing, or how the tool works — or tap a question below.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function ask(question: string) {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");

    // Small delay so the reply feels like a reply, not an instant swap.
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: findAnswer(question) }]);
    }, 450);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[22rem] max-w-[calc(100vw-3rem)] h-[32rem] max-h-[70vh] bg-[#151522] border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          <div className="bg-purple-600 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">EtsyAI Support 🤖</p>
              <p className="text-purple-200 text-xs">Usually replies instantly · 24/7</p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-xl leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-6 ${
                    m.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-black/30 border border-white/10 text-gray-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-purple-300 px-3 py-2 rounded-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ask(input);
              }}
              placeholder="Type your question..."
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
            />

            <button
              onClick={() => ask(input)}
              className="bg-purple-600 hover:bg-purple-700 px-4 rounded-xl font-bold text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 shadow-2xl flex items-center justify-center text-2xl"
        aria-label="Open support chat"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
