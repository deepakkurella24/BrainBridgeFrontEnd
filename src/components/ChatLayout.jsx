import { Outlet, useOutletContext, useParams } from "react-router-dom";
import ChatsSidebar from "./ChatsSidebar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "../utils/socket";

const ChatLayout = () => {
  const { receiverId } = useParams();
  const user = useSelector((store) => store.userState.user);
  const context = useOutletContext();

  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user]);

  return (
    <div className="absolute inset-0 flex w-full h-[100dvh] bg-white overflow-hidden">
      
    
      <div className={`w-full md:w-80 lg:w-96 flex-col shrink-0 ${receiverId ? 'hidden md:flex' : 'flex'}`}>
         <ChatsSidebar />
      </div>


      <div className={`flex-1 flex-col relative ${!receiverId ? 'hidden md:flex' : 'flex'}`}>
         <Outlet context={context} />
      </div>

    </div>
  );
};

export default ChatLayout;