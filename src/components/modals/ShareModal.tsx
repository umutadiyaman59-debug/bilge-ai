import React, { useState } from 'react';
import {
  Copy,
  Check,
  Link,
  MessageCircle,
  Twitter,
  Send,
  Mail,
  Globe,
  Lock,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  conversation,
}) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [includeNames, setIncludeNames] = useState(true);

  if (!conversation) return null;

  // Generate shareable text
  const generateShareText = (): string => {
    const lines = [
      `📌 ${conversation.title}`,
      `🤖 Bilge ile Sohbet`,
      `📅 ${new Date(conversation.createdAt).toLocaleDateString('tr-TR')}`,
      '',
      '---',
      '',
    ];

    conversation.messages.forEach((msg) => {
      const sender = msg.role === 'user' ? (includeNames ? 'Ben' : 'Kullanıcı') : 'Bilge';
      lines.push(`**${sender}:** ${msg.content}`);
      lines.push('');
    });

    lines.push('---');
    lines.push('🇹🇷 Bilge - Türkiye\'nin İlk Yerli Yapay Zekası');
    lines.push('🔗 https://bilge.ai');

    return lines.join('\n');
  };

  // Generate shareable link (base64 encoded - for demo purposes)
  const generateShareLink = (): string => {
    const shareData = {
      t: conversation.title,
      m: conversation.messages.slice(-10).map(m => ({
        r: m.role === 'user' ? 'u' : 'a',
        c: m.content.substring(0, 500),
      })),
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    // In production, this would be a proper short URL
    return `${window.location.origin}/share/${encoded.substring(0, 20)}`;
  };

  // Copy text to clipboard
  const handleCopyText = async () => {
    const text = generateShareText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    const link = generateShareLink();
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Native share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bilge Sohbet: ${conversation.title}`,
          text: generateShareText(),
          url: generateShareLink(),
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  // Share to WhatsApp
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Share to Twitter
  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `🤖 Bilge ile harika bir sohbet yaptım!\n\n"${conversation.title}"\n\n🇹🇷 Türkiye'nin ilk yerli yapay zekası\n🔗 https://bilge.ai`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // Share to Telegram
  const handleTelegramShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://t.me/share/url?url=${encodeURIComponent(generateShareLink())}&text=${text}`, '_blank');
  };

  // Share via Email
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Bilge Sohbet: ${conversation.title}`);
    const body = encodeURIComponent(generateShareText());
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Sohbeti Paylaş
          </DialogTitle>
          <DialogDescription>
            Bu sohbeti arkadaşlarınızla veya sosyal medyada paylaşın
          </DialogDescription>
        </DialogHeader>

        {/* Conversation Preview */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="font-medium text-sm truncate">{conversation.title}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {conversation.messages.length} mesaj • {new Date(conversation.createdAt).toLocaleDateString('tr-TR')}
          </p>
        </div>

        {/* Privacy Options */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPublic ? <Globe className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-orange-500" />}
              <span className="text-sm">Herkese açık link</span>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">İsimleri göster</span>
            <Switch checked={includeNames} onCheckedChange={setIncludeNames} />
          </div>
        </div>

        {/* Copy Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={handleCopyLink}
          >
            {linkCopied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Kopyalandı!
              </>
            ) : (
              <>
                <Link className="h-4 w-4" />
                Linki Kopyala
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={handleCopyText}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Kopyalandı!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Metni Kopyala
              </>
            )}
          </Button>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Şurada paylaş:</p>
          <div className="grid grid-cols-4 gap-2">
            {/* WhatsApp */}
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-full hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-600"
              onClick={handleWhatsAppShare}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Twitter */}
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-full hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-500"
              onClick={handleTwitterShare}
            >
              <Twitter className="h-5 w-5" />
            </Button>

            {/* Telegram */}
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-full hover:bg-sky-500/10 hover:border-sky-500/50 hover:text-sky-500"
              onClick={handleTelegramShare}
            >
              <Send className="h-5 w-5" />
            </Button>

            {/* Email */}
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-full hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-500"
              onClick={handleEmailShare}
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Native Share Button (for mobile) */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <Button
            className="w-full mt-4 gap-2"
            onClick={handleNativeShare}
          >
            <Share2 className="h-4 w-4" />
            Paylaş
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
