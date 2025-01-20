import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-gray-100/50 dark:bg-gray-800">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center
             justify-center animate-bounce shadow-lg"
            >
              <MessageSquare className="w-8 h-8 text-primary dark:text-primary-light" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Chatty!</h2>
        <p className="text-gray-600 dark:text-gray-content/70">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;