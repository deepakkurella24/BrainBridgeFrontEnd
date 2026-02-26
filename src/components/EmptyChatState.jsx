// const CURRENT_USER = {
//   id: 'me',
//   name: "Alex Thompson",
//   avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300"
// };


const EmptyChatState = () => (
  <div className="hidden md:flex h-full flex-col items-center justify-center text-slate-500 bg-[#F8FAFC]">
    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
      <MessageCircleIcon />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">Your Messages</h3>
    <p className="text-sm font-medium">Select a conversation to start messaging</p>
  </div>
);


const MessageCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default EmptyChatState