import React, { useState } from 'react';
import {
  UserPlus,
  Mail,
  Copy,
  Check,
  Link,
  Users,
  Crown,
  Eye,
  Edit3,
  ChevronDown,
  X,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

type Permission = 'view' | 'edit' | 'admin';

interface InvitedUser {
  email: string;
  permission: Permission;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  open,
  onClose,
  conversation,
}) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<Permission>('view');
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  if (!conversation) return null;

  // Generate invite link
  const generateInviteLink = (): string => {
    const inviteCode = btoa(conversation.id).substring(0, 12);
    return `${window.location.origin}/invite/${inviteCode}`;
  };

  // Validate email
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle email input
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  // Add user to invite list
  const handleAddUser = () => {
    if (!email.trim()) {
      setEmailError('E-posta adresi gerekli');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Geçerli bir e-posta adresi girin');
      return;
    }
    if (invitedUsers.some(u => u.email === email)) {
      setEmailError('Bu e-posta zaten eklendi');
      return;
    }

    setInvitedUsers([...invitedUsers, { email, permission }]);
    setEmail('');
    setPermission('view');
  };

  // Remove user from list
  const handleRemoveUser = (email: string) => {
    setInvitedUsers(invitedUsers.filter(u => u.email !== email));
  };

  // Send invites
  const handleSendInvites = () => {
    // In production, this would send actual invites via API
    console.log('Sending invites to:', invitedUsers);
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInvitedUsers([]);
      onClose();
    }, 2000);
  };

  // Copy link
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(generateInviteLink());
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUser();
    }
  };

  // Permission icon
  const getPermissionIcon = (perm: Permission) => {
    switch (perm) {
      case 'view': return <Eye className="h-3 w-3" />;
      case 'edit': return <Edit3 className="h-3 w-3" />;
      case 'admin': return <Crown className="h-3 w-3" />;
    }
  };

  // Permission label
  const getPermissionLabel = (perm: Permission) => {
    switch (perm) {
      case 'view': return 'Görüntüleyebilir';
      case 'edit': return 'Düzenleyebilir';
      case 'admin': return 'Yönetici';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Kişi Ekle
          </DialogTitle>
          <DialogDescription>
            Bu sohbete başkalarını davet edin ve birlikte çalışın
          </DialogDescription>
        </DialogHeader>

        {/* Conversation Info */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium text-sm truncate">{conversation.title}</p>
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="E-posta adresi girin"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                className={cn(emailError && 'border-destructive')}
              />
              {emailError && (
                <p className="text-xs text-destructive mt-1">{emailError}</p>
              )}
            </div>
            <Select value={permission} onValueChange={(v) => setPermission(v as Permission)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    Görüntüle
                  </div>
                </SelectItem>
                <SelectItem value="edit">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-3 w-3" />
                    Düzenle
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Crown className="h-3 w-3" />
                    Yönetici
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddUser} size="icon">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Invited Users List */}
        {invitedUsers.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            <p className="text-xs text-muted-foreground font-medium">Davet edilecekler:</p>
            {invitedUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {getPermissionIcon(user.permission)}
                    {getPermissionLabel(user.permission)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveUser(user.email)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">veya</span>
          </div>
        </div>

        {/* Copy Link */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Davet linki ile paylaş:</p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={generateInviteLink()}
              className="text-xs bg-muted/30"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
            >
              {linkCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Send Invites Button */}
        {invitedUsers.length > 0 && (
          <Button
            className="w-full mt-2 gap-2"
            onClick={handleSendInvites}
            disabled={inviteSent}
          >
            {inviteSent ? (
              <>
                <Check className="h-4 w-4" />
                Davetler Gönderildi!
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {invitedUsers.length} Kişiye Davet Gönder
              </>
            )}
          </Button>
        )}

        {/* Info Note */}
        <p className="text-xs text-muted-foreground text-center mt-2">
          Davet edilen kişiler bu sohbeti görüntüleyebilecek ve katkıda bulunabilecek.
        </p>
      </DialogContent>
    </Dialog>
  );
};
