import { useEffect } from 'react';
import { VttCanvas } from './canvas/VttCanvas';
import { CreatorModal } from './hud/CreatorModal';
import { DiceShow } from './hud/DiceShow';
import { DmToolbar } from './hud/DmToolbar';
import { JoinGate } from './hud/JoinGate';
import { LobbyPanel } from './hud/LobbyPanel';
import { PlayerHud } from './hud/PlayerHud';
import { SheetWindow } from './hud/SheetWindow';
import { TargetCard } from './hud/TargetCard';
import { Sidebar } from './hud/Sidebar';
import { InventoryPanel } from './hud/InventoryPanel';
import { useVttStore } from './store';

export function App() {
  const joined = useVttStore((s) => s.joined);
  const snapshot = useVttStore((s) => s.snapshot);
  const me = useVttStore((s) => s.me);
  const toast = useVttStore((s) => s.toast);
  const toastType = useVttStore((s) => s.toastType);
  const toggleInventoryOpen = useVttStore((s) => s.toggleInventoryOpen);

  // Proteção: só renderiza a se todas as condições críticas estiverem atendidas
  const isInitialized = joined && me && snapshot;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') return;
      if (e.key === 'i' || e.key === 'I') toggleInventoryOpen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleInventoryOpen]);

  // Só renderiza a mesa se todos os estados críticos estiverem definidos
  if (!isInitialized) {
    return <JoinGate />;
  }

  return (
    <div className="app">
      <div className="main-row">
        {me.role === 'dm' && <DmToolbar />}
        <div className="stage">
          <div className="canvas-wrap">
            <VttCanvas />
            <div className="vignette" aria-hidden="true" />
          </div>
          <PlayerHud />
          <TargetCard />
        </div>
        <Sidebar />
      </div>
      <CreatorModal />
      <SheetWindow />
      <LobbyPanel />
      <DiceShow />
      <InventoryPanel />
      {toast && <div className={`toast ${toastType === 'error' ? 'toast-error' : ''}`}>{toast}</div>}
    </div>
  );
}
