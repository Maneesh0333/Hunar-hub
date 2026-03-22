import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      from: "artisan",
      text: "Assalamu Alaikum! I saw your booking request 🙏",
      time: "10:14 AM",
    },
    {
      from: "artisan",
      text: "Can you share the fabric and reference images?",
      time: "10:14 AM",
    },
    {
      from: "user",
      text: "Walaikum Assalam! I have Banarasi silk fabric.",
      time: "10:18 AM ✓✓",
    },
    {
      from: "artisan",
      text: "MashAllah, lovely choice 🌟 I can finish it in 2 days.",
      time: "10:22 AM",
    },
    {
      from: "user",
      text: "Walaikum Assalam! I have Banarasi silk fabric.",
      time: "10:18 AM ✓✓",
    }
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input, time: "Now ✓" }]);
    setInput("");
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex-1 flex flex-col bg-[#FAF5ED] font-sans text-[#2C1A0E]">
      {/* NAVBAR */}
      <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-[#C4632A]/10">
        <div className="text-xl font-black">
          <span className="text-[#C4632A]">Hunar</span>Hub
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-lg border border-[rgba(196,99,42,0.13)]">
            🔔
          </button>
          <button className="w-8 h-8 rounded-lg border border-[rgba(196,99,42,0.13)]">
            ⚙️
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-80 bg-white border-r border-[#C4632A]/10 hidden md:flex flex-col">
          <div className="p-4 border-b border-[rgba(196,99,42,0.13)]">
            <h2 className="font-bold text-xl">Messages</h2>
            <div className="flex gap-3 mt-3 w-full px-3 py-2 rounded-lg bg-[#FAF5ED]">
              <span>🔍</span>
              <input
                placeholder="Search conversations..."
                className="text-sm outline-none w-full"
              />
            </div>
          </div>

          <div className="py-3 px-4 border-b border-[rgba(196,99,42,0.13)] flex gap-3">
            <span className="inline-block text-[12px] px-3 py-1 font-semibold rounded-full border border-[rgba(196,99,42,0.12)] bg-[var(--clay)] text-[var(--cream)]">
              All
            </span>

            <span className="inline-block text-[12px] px-3 py-1 font-semibold rounded-full border border-[rgba(196,99,42,0.12)] bg-[var(--cream)] text-[var(--clay)]">
              Unread
            </span>

            <span className="inline-block text-[12px] px-3 py-1 font-semibold rounded-full border border-[rgba(196,99,42,0.12)] bg-[var(--cream)] text-[var(--clay)]">
              Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-between bg-[var(--cream)] border-b border-[rgba(196,99,42,0.13)] cursor-pointer">
              <div className="flex items-center px-4 py-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B3E15] to-[#C4632A] flex items-center justify-center text-white">
                  🧵
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-sm">Rashida Begum</div>
                  <div className="text-xs text-[var(--ink)] truncate">
                    I can do the blouse in 2 days…
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 justify-center">
                <span className="text-[11px]">2m</span>
                <span className="bg-[var(--clay)] rounded-full text-[11px] h-5 w-5 flex items-center justify-center font-semibold text-[var(--warm-white)]">
                  2
                </span>
              </div>
              <div className="w-1 rounded-2xl bg-[var(--clay)]" />
            </div>

            <div className="flex justify-between bg-[var(--cream-light)] border-b border-[rgba(196,99,42,0.13)] cursor-pointer">
              <div className="flex items-center px-4 py-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B3E15] to-[#C4632A] flex items-center justify-center text-white">
                  🧵
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-sm">Rashida Begum</div>
                  <div className="text-xs text-[var(--ink)] truncate">
                    I can do the blouse in 2 days…
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex flex-col flex-1">
          {/* CHAT HEADER */}
          <div className="flex items-center gap-3 p-4 bg-white border-b border-[rgba(196,99,42,0.13)]">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B3E15] to-[#C4632A] flex items-center justify-center text-white">
              🧵
            </div>
            <div>
              <div className="font-bold">Rashida Begum</div>
              <div className="flex items-center justify-center gap-0.5 text-xs text-[var(--sage)]">
                <span className="animate-pulse text-green-500">●</span> Online ·
                Master Tailor
              </div>
            </div>
          </div>

          {/* BOOKING BAR */}
          <div className="mx-4 mt-3 bg-white border border-[rgba(196,99,42,0.13)] rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-[#C4632A] uppercase">
                Pending Booking
              </div>
              <div className="font-semibold">Blouse Stitching · ₹299</div>
              <div className="text-xs text-gray-600">
                21 Feb · 10:00 AM · Home Visit
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-[var(--sage)] text-white px-4 py-2 rounded-lg text-sm">
                Accept
              </button>
              <button className="bg-[var(--cream)] text-[var(--clay-light)] px-4 py-2 rounded-lg text-sm">
                X
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.from === "user" ? "justify-end" : ""}`}
              >
                {msg.from === "artisan" && (
                  <div className="w-7 h-7 rounded-md bg-[var(--clay)] text-white flex items-center justify-center">
                    🧵
                  </div>
                )}

                <div
                  className={`max-w-[65%] px-4 py-3 text-sm rounded-2xl
                  ${
                    msg.from === "user"
                      ? "bg-[var(--clay)] text-white rounded-br-md"
                      : "bg-white border border-[rgba(196,99,42,0.13)] rounded-bl-md"
                  }`}
                >
                  {msg.text}
                  <div className="text-[10px] opacity-70 mt-1 text-right">
                    {msg.time}
                  </div>
                </div>

                {msg.from === "user" && (
                  <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center">
                    👤
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK REPLIES */}
          <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-[rgba(196,99,42,0.13)]">
            {[
              "👍 Sounds good",
              "What’s the price?",
              "Can you come earlier?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-4 py-1.5 rounded-full text-xs border border-[rgba(196,99,42,0.13)] text-[var(--clay)] hover:bg-[var(--clay)] hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div className="bg-white border-t border-[rgba(196,99,42,0.13)] px-4 py-3">
            <div className="flex items-center gap-2 bg-[#FAF5ED] border border-[rgba(196,99,42,0.13)] rounded-xl px-3 py-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="Type a message…"
                className="flex-1 resize-none bg-transparent outline-none text-sm"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
              />
              <button
                onClick={sendMessage}
                className="w-9 h-9 bg-[#C4632A] text-white rounded-lg"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
