import { currentUser } from "@clerk/nextjs/server";
import { ChatInterface } from "@/components/chat-interface";

export default async function AiHelpPage() {
  const user = await currentUser();
  
  // User can be null if not signed in. ChatInterface will handle prompting to sign in.
  const userId = user?.id;
  const userImageUrl = user?.imageUrl || undefined;

  return (
    // Adjust height calculation based on your actual header/footer height
    // h-[calc(100vh-HEADER_HEIGHT-FOOTER_HEIGHT)]
    // Assuming header+footer is roughly 160px for now
    <div className="container mx-auto h-[calc(100vh-120px)] flex flex-col pt-2 md:pt-4">
      {/* Removed AI Assistant h1 title */}
      {/* Adjusted h-[calc(100vh-160px)] to h-[calc(100vh-120px)] and removed py/mb to give more space */}
      <ChatInterface 
        className="flex-1 min-h-0" 
        userId={userId} 
        userImageUrl={userImageUrl} 
      />
    </div>
  );
}