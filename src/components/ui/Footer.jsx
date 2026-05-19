import React from 'react';
import { CONTRACT_ADDRESS } from '../../constants/contract';
import { Copy } from 'lucide-react';

export function Footer() {
  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    alert('Contract address copied!');
  };

  return (
    <footer className="bg-dracula-surface border-t border-dracula-comment py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-dracula-fg opacity-80">
          Built by <a href="http://www.codexero.xyz/" target="_blank" rel="noreferrer" className="text-dracula-cyan hover:text-dracula-pink transition-colors">CodeXero</a> - 
          Powered by <a href="https://www.clusterprotocol.ai/" target="_blank" rel="noreferrer" className="text-dracula-purple hover:text-dracula-pink transition-colors">Cluster Protocol</a>
        </div>
        
        <div className="flex items-center gap-2 text-sm bg-dracula-bg px-3 py-1.5 rounded-md border border-dracula-comment">
          <span className="text-dracula-comment">Contract:</span>
          <span className="font-mono text-dracula-green">{`${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`}</span>
          <button onClick={copyAddress} className="text-dracula-fg hover:text-dracula-cyan transition-colors ml-1">
            <Copy size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
