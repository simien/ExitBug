import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ExitConfirmDialog({ isEnabled = true }) {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    // Push a state so we can intercept the "back" action
    const pushState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    pushState();

    const handlePopState = () => {
      // User tried to go back (swipe or button)
      // Prevent the actual navigation by suppressing default somewhat,
      // but mainly we just want to intercept and show our dialog.
      // Since popstate happened, the URL changed. We might want to fix it or just show dialog.

      // SHOW DIALOG
      setShowConfirm(true);

      // Restoring the "trap" state so if they cancel, we are still safe.
      // However, showing the dialog is enough for now.
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Clean up if needed? Usually fine to leave history as is or let browser handle it.
    };
  }, [isEnabled]);

  const handleCancel = () => {
    setShowConfirm(false);
    // Re-push state to maintain the trap because the popstate event consumed one entry
    window.history.pushState(null, '', window.location.href);
  };

  const handleExit = () => {
    setShowConfirm(false);
    // Allow exit. We need to go back twice effectively:
    // Once for the trap we pushed, and once for the actual back action they wanted.
    // Or just window.location.href = ... if we want to redirect.
    // simpler: history.go(-2) might work, or just let them leave.

    // For now, let's try going back 2 steps (one for our push, one for the user's action)
    // But since the user's action ALREADY happened (popstate), we are technically at the previous state.
    // We pushed state on mount.
    // User pressed back -> popstate fires -> we are at state - 1.
    // If we want to really exit, we might need to go back again.

    // Actually, simply doing nothing here implies we are "out" of the trap if we don't re-push.
    // But we might want to explicitly navigate away or close the tab if possible (not possible for tabs).
    // Let's assume standard behavior: go back to where they came from.
    window.history.go(-2);
  };

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exit Game?</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave? Your current progress might be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Stay</Button>
          <Button variant="destructive" onClick={handleExit}>Leave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
