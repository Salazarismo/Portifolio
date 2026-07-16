import { useEffect, useState } from "preact/hooks";
import { SegmentedButton } from "./SegmentedButton";

// Toggle recrutador/cliente da home-manifesto. Não renderiza conteúdo:
// ambas as variações já viajam no HTML estático e o CSS mostra/esconde
// via #home-root[data-mode]. Sem persistência (contrato do índice-mãe §4.3):
// recarregou, voltou ao default do SSR.
type Mode = "recruiter" | "client";

interface Props {
  recruiterLabel: string;
  clientLabel: string;
  ariaLabel?: string;
  rootId?: string;
}

export default function ModeToggle({
  recruiterLabel,
  clientLabel,
  ariaLabel,
  rootId = "home-root"
}: Props) {
  const [mode, setMode] = useState<Mode>("recruiter");

  // Adota o modo que o SSR já pintou: o DOM é a fonte de verdade, então
  // controle e CSS-swap nunca divergem se o default mudar no index.astro.
  useEffect(() => {
    const m = document.getElementById(rootId)?.dataset.mode;
    if (m === "recruiter" || m === "client") setMode(m);
  }, [rootId]);

  const apply = (next: Mode) => {
    setMode(next);
    const root = document.getElementById(rootId);
    if (root) root.dataset.mode = next;
  };

  return (
    <SegmentedButton
      buttons={[
        { id: "recruiter", label: recruiterLabel },
        { id: "client", label: clientLabel }
      ]}
      activeId={mode}
      onChange={(id) => apply(id as Mode)}
      ariaLabel={ariaLabel}
      className="hm-mode-seg"
    />
  );
}
