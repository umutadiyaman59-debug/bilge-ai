import React, { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { ErrorBanner } from '@/components/chat/ErrorBanner';
import { OnboardingModal } from '@/components/modals/OnboardingModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { InviteModal } from '@/components/modals/InviteModal';
import { WavingFlagBadge } from '@/components/TurkishFlag';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    streamingContent,
    error: chatError,
    sendMessage,
    createNewConversation,
    deleteConversation,
    clearAllConversations,
    exportConversations,
    exportToPDF,
  } = useChat();

  // Check for first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('bilge-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem('bilge-onboarding-seen', 'true');
    setShowOnboarding(false);
  };

  const handleNewChat = () => {
    createNewConversation();
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  };

  const handleExampleClick = (message: string) => {
    sendMessage(message);
  };

  // Sync errors
  useEffect(() => {
    if (chatError) {
      setError(chatError);
    }
  }, [chatError]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={deleteConversation}
        onClearAll={clearAllConversations}
        onExport={exportConversations}
        onOpenSettings={() => setShowSettings(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => setShowSettings(true)}
          onShareClick={() => setShowShare(true)}
          onInviteClick={() => setShowInvite(true)}
          hasActiveConversation={!!activeConversation && activeConversation.messages.length > 0}
        />

        {/* Error banner */}
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        {/* Chat area */}
        <ChatArea
          messages={activeConversation?.messages || []}
          isLoading={isLoading}
          streamingContent={streamingContent}
          onExampleClick={handleExampleClick}
        />

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </main>

      {/* Modals */}
      <OnboardingModal open={showOnboarding} onClose={handleCloseOnboarding} />
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onClearAll={clearAllConversations}
        onExport={exportConversations}
        onExportPDF={exportToPDF}
      />
      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        conversation={activeConversation}
      />
      <InviteModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        conversation={activeConversation}
      />

      {/* Dalgalanan Türk Bayrağı - Sağ Alt Köşe */}
      <WavingFlagBadge position="bottom-right" />
    </div>
  );
};

export default Index;
