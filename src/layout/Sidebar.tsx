import "./Layout.scss";
import { LuMenu } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { MdBrightness5 } from "react-icons/md";
import { useAppContext } from "../context/AppContext";
import { TiDelete } from "react-icons/ti";
import { toast } from "react-toastify";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { chats, setChats, activeChatId, createNewChat, setActiveChatId } =
    useAppContext();

  const recentChats = chats.filter((chat) => chat.id !== activeChatId) || [];

  const handleDelete = (id: string) => {
    const updated = chats.filter((item) => item.id !== id);
    setChats(updated);
    toast.success("Deleted Successfully!");
  };

  return (
    <div
      className={`layout-sidebar ${
        open ? "layout-sidebar-open" : "layout-sidebar-close"
      }`}
    >
      <div className="sidebar-logo">
        <span onClick={() => setOpen((pre) => !pre)}>
          <LuMenu />
        </span>
        <span className="search-icon">
          <IoSearch />
        </span>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-list">
          <p className={`nav`} onClick={() => createNewChat()} title="New Chat">
            <FaRegEdit />
            <span>New Chat</span>
          </p>
        </div>
        <div className="recent-data">
          <h5>Recent</h5>
          {recentChats.map((recent, inx) => (
            <p key={`recent_${inx}`} onClick={() => setActiveChatId(recent.id)}>
              <TiDelete
                title="delete"
                onClick={() => handleDelete(recent.id)}
              />
              {recent.title}
            </p>
          ))}
        </div>
        <div className="sidebar-footer">
          <p title="Settings & Help">
            <MdBrightness5 /> <span>Settings & Help</span>
          </p>
        </div>
      </div>
    </div>
  );
}
