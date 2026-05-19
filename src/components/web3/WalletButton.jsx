import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';

export function WalletButton() {
  const { address, isConnecting, connectWallet, disconnectWallet } = useWeb3();

  if (address) {
    return (
      <button 
        onClick={disconnectWallet}
        className="flex items-center gap-2 bg-dracula-surface hover:bg-dracula-comment text-dracula-cyan border border-dracula-cyan px-4 py-2 rounded-lg transition-colors font-medium text-sm"
      >
        <Wallet size={16} />
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
        <LogOut size={14} className="ml-1 opacity-70" />
      </button>
    );
  }

  return (
    <button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-dracula-purple hover:bg-dracula-pink text-dracula-bg px-4 py-2 rounded-lg transition-colors font-semibold text-sm disabled:opacity-70"
    >
      <Wallet size={16} />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
