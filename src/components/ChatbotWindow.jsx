import React, { useState, useRef } from "react";
import { askChat } from "../api/ai";

const ChatbotWindow = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState(false);
  const windowRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pos = useRef({ x: 40, y: window.innerHeight - 320 });
  const drag = useRef({ active: false, offsetX: 0, offsetY: 0 });
  const ZOOMED_OUT = {
    width: 340,
    height: 320,
    headerFont: "1.15em",
    headerPad: "12px 20px",
    msgFont: "1.05em",
    msgPad: "18px 16px 10px 16px",
    inputFont: "1em",
    inputPad: "12px 20px",
    inputBtnPad: "10px 22px",
    inputRadius: 10,
    headerRadius: 12,
    inputRadiusArea: 22,
    msgMaxHeight: 230
  };
  const ZOOMED_IN = {
    width: 520,
    height: 480,
    headerFont: "1.15em", // keep header font size the same
    headerPad: "18px 32px",
    msgFont: "1.05em",    // keep message font size the same
    msgPad: "28px 24px 16px 24px",
    inputFont: "1em",     // keep input font size the same
    inputPad: "18px 32px",
    inputBtnPad: "14px 32px",
    inputRadius: 16,
    headerRadius: 18,
    inputRadiusArea: 28,
    msgMaxHeight: 370
  };
  const [zoomed, setZoomed] = useState(false);
  const styleVars = zoomed ? ZOOMED_IN : ZOOMED_OUT;

  // Reset position when zoomed in
  const handleZoom = () => {
    if (!zoomed) {
      pos.current.x = 80;
      pos.current.y = 80;
      if (windowRef.current) {
        windowRef.current.style.left = `${pos.current.x}px`;
        windowRef.current.style.top = `${pos.current.y}px`;
      }
    }
    setZoomed(z => !z);
  };

  // Drag logic
  const onMouseDown = (e) => {
    drag.current.active = true;
    drag.current.offsetX = e.clientX - pos.current.x;
    drag.current.offsetY = e.clientY - pos.current.y;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    pos.current.x = e.clientX - drag.current.offsetX;
    pos.current.y = e.clientY - drag.current.offsetY;
    if (windowRef.current) {
      windowRef.current.style.left = `${pos.current.x}px`;
      windowRef.current.style.top = `${pos.current.y}px`;
    }
  };
  const onMouseUp = () => {
    drag.current.active = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Send message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const streamTimeout = useRef();
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStreaming("");
    setMessages((msgs) => [...msgs, { role: "user", text: input }]);
    setTimeout(scrollToBottom, 50);
    try {
      const data = await askChat(input);
      // Streaming effect
      const text = data.response || "No response.";
      let i = 0;
      const streamStep = () => {
        setStreaming(text.slice(0, i));
        setTimeout(scrollToBottom, 1);
            if (i < text.length) {
              i += 2;
              streamTimeout.current = setTimeout(streamStep, 50);
        } else {
          setMessages((msgs) => [...msgs, { role: "bot", text }]);
          setStreaming("");
          setTimeout(scrollToBottom, 50);
        }
      };
      if (streamTimeout.current) clearTimeout(streamTimeout.current);
      streamStep();
    } catch {
      setMessages((msgs) => [...msgs, { role: "bot", text: "AI request failed." }]);
      setStreaming("");
      setTimeout(scrollToBottom, 50);
    }
    setInput("");
    setLoading(false);
  };
  React.useEffect(() => {
    return () => {
      if (streamTimeout.current) clearTimeout(streamTimeout.current);
    };
  }, []);

  return (
    <>
      {/* Floating chat icon */}
      <div
        style={{
          position: "fixed",
          left: 32,
          bottom: 32,
          zIndex: 2000,
          cursor: "pointer",
          background: "linear-gradient(135deg, #2563eb 70%, #38bdf8 100%)",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 4px 16px 0 rgba(37,99,235,0.18)",
          display: open ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={() => {
          pos.current.x = 40;
          pos.current.y = window.innerHeight - 320 - 80;
          setZoomed(false);
          setOpen(true);
        }}
        title="Open Chatbot"
      >
        <span role="img" aria-label="chat" style={{ fontSize: 32 }}>💬</span>
      </div>
      {/* Chat window with smooth transition */}
      <div
        ref={windowRef}
        style={{
          position: "fixed",
          left: pos.current.x,
          top: pos.current.y,
          zIndex: 2100,
          width: styleVars.width,
          minHeight: styleVars.height,
          background: "rgba(248,250,252,0.75)",
          borderRadius: styleVars.headerRadius,
          boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
          border: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          cursor: "move",
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.95)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)"
        }}
        onMouseDown={onMouseDown}
      >
          {/* Header */}
          <div
            style={{
              padding: styleVars.headerPad,
              background: "rgba(37,99,235,0.75)",
              color: "#fff",
              borderTopLeftRadius: styleVars.headerRadius,
              borderTopRightRadius: styleVars.headerRadius,
              fontWeight: 700,
              fontSize: styleVars.headerFont,
              display: "flex",
              alignItems: "center",
              userSelect: "none",
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)"
            }}
          >
            <span role="img" aria-label="magic" style={{ fontSize: 24, marginRight: 10 }}>🪄</span>
            TEMPO Chatbot
            <button
              style={{ marginLeft: "auto", background: "none", border: "none", color: "#fff", fontSize: styleVars.headerFont, cursor: "pointer", transition: "color 0.2s", marginRight: 8 }}
              onClick={handleZoom}
              title={zoomed ? "Zoom Out" : "Zoom In"}
              onMouseOver={e => e.currentTarget.style.color = "#fbbf24"}
              onMouseOut={e => e.currentTarget.style.color = "#fff"}
            >
              {zoomed ? <span style={{ fontSize: styleVars.headerFont, fontWeight: 700 }}>🔍-</span> : <span style={{ fontSize: styleVars.headerFont, fontWeight: 700 }}>🔍+</span>}
            </button>
            <button
              style={{ background: "none", border: "none", color: "#fff", fontSize: styleVars.headerFont, cursor: "pointer", transition: "color 0.2s" }}
              onClick={() => setOpen(false)}
              title="Close"
              onMouseOver={e => e.currentTarget.style.color = "#fbbf24"}
              onMouseOut={e => e.currentTarget.style.color = "#fff"}
            >
              &times;
            </button>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, padding: styleVars.msgPad, overflowY: "auto", fontSize: styleVars.msgFont, maxHeight: styleVars.msgMaxHeight, background: "rgba(255,255,255,0.55)", borderBottom: "1px solid #fbbf24", fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
            {messages.length === 0 && (
              <div style={{ marginBottom: 14, textAlign: "left" }}>
                <span style={{
                  display: "inline-block",
                  background: "linear-gradient(90deg, #fffbe6 80%, #fbbf24 100%)",
                  color: "#222",
                  borderRadius: zoomed ? 20 : 16,
                  padding: zoomed ? "12px 22px" : "8px 16px",
                  fontFamily: 'Caveat, Comic Sans MS, cursive',
                  fontSize: styleVars.msgFont,
                  boxShadow: "0 2px 12px 0 rgba(255, 224, 102, 0.12)",
                  border: "1px solid #fbbf24"
                }}>
                  Hello, I am an expert in atmospheric science. How can I help you today?
                </span>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: 14,
                textAlign: msg.role === "user" ? "right" : "left"
              }}>
                <span style={{
                  display: "inline-block",
                  background: msg.role === "user" ? "linear-gradient(90deg, #e0f2fe 80%, #bae6fd 100%)" : "linear-gradient(90deg, #fffbe6 80%, #fbbf24 100%)",
                  color: msg.role === "user" ? "#2563eb" : "#222",
                  borderRadius: zoomed ? 20 : 16,
                  padding: zoomed ? "12px 22px" : "8px 16px",
                  fontFamily: msg.role === "bot" ? 'Caveat, Comic Sans MS, cursive' : 'Inter, Segoe UI, Arial, sans-serif',
                  fontSize: styleVars.msgFont,
                  boxShadow: msg.role === "bot" ? "0 2px 12px 0 rgba(255, 224, 102, 0.12)" : "0 1px 4px 0 rgba(37,99,235,0.08)",
                  border: msg.role === "user" ? "1px solid #38bdf8" : "1px solid #fbbf24"
                }}>{msg.text}</span>
              </div>
            ))}
            {streaming && (
              <div style={{ textAlign: "left", marginBottom: 14 }}>
                <span style={{
                  display: "inline-block",
                  background: "linear-gradient(90deg, #fffbe6 80%, #fbbf24 100%)",
                  color: "#222",
                  borderRadius: zoomed ? 20 : 16,
                  padding: zoomed ? "12px 22px" : "8px 16px",
                  fontFamily: 'Caveat, Comic Sans MS, cursive',
                  fontSize: styleVars.msgFont,
                  boxShadow: "0 2px 12px 0 rgba(255, 224, 102, 0.12)",
                  border: "1px solid #fbbf24"
                }}>{streaming}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <form
            style={{ display: "flex", padding: styleVars.inputPad, borderTop: "1px solid #fbbf24", background: "rgba(255,255,255,0.75)", borderBottomLeftRadius: styleVars.inputRadiusArea, borderBottomRightRadius: styleVars.inputRadiusArea, alignItems: "center" }}
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              rows={2}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: styleVars.inputFont,
                padding: "10px 12px",
                borderRadius: styleVars.inputRadius,
                background: "#fff",
                fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                boxShadow: "0 1px 4px 0 rgba(37,99,235,0.08)",
                resize: "vertical",
                minHeight: "2.5em",
                maxHeight: "6em"
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                marginLeft: 10,
                background: "linear-gradient(90deg, #2563eb 80%, #38bdf8 100%)",
                color: "#fff",
                border: "none",
                borderRadius: styleVars.inputRadius,
                fontWeight: 700,
                fontSize: styleVars.inputFont,
                padding: styleVars.inputBtnPad,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)",
                transition: "background 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={e => { e.currentTarget.style.background = "linear-gradient(90deg, #38bdf8 80%, #2563eb 100%)"; e.currentTarget.style.boxShadow = "0 4px 16px 0 rgba(37,99,235,0.18)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "linear-gradient(90deg, #2563eb 80%, #38bdf8 100%)"; e.currentTarget.style.boxShadow = "0 2px 8px 0 rgba(37,99,235,0.10)"; }}
            >
              Send
            </button>
          </form>
        </div>
      
    </>
  );
};

export default ChatbotWindow;
