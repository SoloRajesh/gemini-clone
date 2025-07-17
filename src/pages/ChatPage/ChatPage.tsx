import "./ChatPage.scss";
import { IoMdSend } from "react-icons/io";
import { TbFileUpload, TbWorldSearch } from "react-icons/tb";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { MdKeyboardVoice } from "react-icons/md";
import { useAppContext } from "../../context/AppContext";
import geminiIcon from "../../assets/gemini-icon.svg";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

export default function ChatPage() {
  const { onSentMessage, input, setInput, activeChatId, chats, isLoading } =
    useAppContext();
  const [imageUrl, setImageUrl] = useState<string>("");
  const user = JSON.parse(localStorage.getItem("loginData") || "{}");

  const messages =
    chats.find((chat) => chat.id === activeChatId)?.messages || [];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const blob = URL.createObjectURL(files[0]);
      setImageUrl(blob);
    }
  };

  return (
    <div id="chat-page">
      <div className="chat-content">
        {messages.length < 1 ? (
          <h5 className="welcome">
            <span className="name">Hello, {user?.name || "Rajesh"}.</span>
            <span>How can I help you today?</span>
          </h5>
        ) : (
          <>
            {messages.map((message, inx) => (
              <div
                key={`${message.sender}_${inx}`}
                className={`response-box response-box-${message.sender}`}
              >
                {message.sender === "user" ? (
                  <p className="prompt-message">{message.text}</p>
                ) : (
                  <div className="response-message">
                    <img src={geminiIcon} alt="gemini-icon" />
                    <p dangerouslySetInnerHTML={{ __html: message.text }} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="response-box response-box-assistant">
                <div className="response-message loading-skeleton">
                  <img
                    src={geminiIcon}
                    alt="gemini-icon"
                    width={40}
                    height={40}
                  />
                  <div className="skeleton-text">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div
        className={`chat-input ${imageUrl !== "" ? "chat-input-upload" : ""}`}
      >
        <textarea
          placeholder="Ask Gemini"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        {imageUrl !== "" && (
          <div className="file-preview">
            <img src={imageUrl} alt="img-preview" />
            <RxCross2 onClick={() => setImageUrl("")} />
          </div>
        )}
        <div className="input-icons">
          <label htmlFor="file-upload" className="file-action">
            <input type="file" id="file-upload" onChange={handleUpload} />
            <span>
              <TbFileUpload />
            </span>
          </label>
          <span>
            <TbWorldSearch />
            Deep Research
          </span>
          <span>
            <HiOutlineDocumentAdd />
            Canvas
          </span>
        </div>
        <span>
          {input !== "" ? (
            <IoMdSend onClick={() => onSentMessage(input)} />
          ) : (
            <MdKeyboardVoice />
          )}
        </span>
      </div>
      <p className="note">Gemini can make mistakes, so double-check it</p>
    </div>
  );
}
