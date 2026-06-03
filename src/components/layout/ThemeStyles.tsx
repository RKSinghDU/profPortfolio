export function ThemeStyles() {
  return (
    <style>{`
      @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
      .theme-light, .theme-dark{
        transition: background-color .35s ease, color .35s ease;
      }
      .theme-light *{ transition: background-color .35s ease, border-color .35s ease, color .35s ease; }
      .theme-dark *{ transition: background-color .35s ease, border-color .35s ease, color .35s ease; }

      /* ---------- WARM HERITAGE · LIGHT ---------- */
      .theme-light{
        --bg:#FBF5E9;
        --surface:#FFFBF2;
        --panel:#F1E8D6;
        --heading:#1F2247;
        --heading-hover:#2A2E5C;
        --ink:#2A2740;
        --body:#46425C;
        --muted2:#5A566E;
        --muted:#6E6A82;
        --placeholder:#9A93A8;
        --accent:#C1502E;
        --accent-deep:#A3401F;
        --gold:#B8862F;
        --skeleton:#EADfca;
        --disabled:#C9A99B;
        --ok-bg:#E6EFDF;  --ok-fg:#3D6B2E;
        --err-bg:#F3DAD2; --err-fg:#A3401F;
        --footer-bg:#1F2247; --footer-text:#D9D5E4; --footer-name:#E9C46A;
        --nav-bg:rgba(251,245,233,0.85);
        --line:rgba(193,80,46,0.20);
        --line2:rgba(193,80,46,0.15);
        --line3:rgba(193,80,46,0.25);
        --line-input:rgba(193,80,46,0.30);
        --accent-45:rgba(193,80,46,0.45);
        --accent-10:rgba(193,80,46,0.10);
        --line-ink:rgba(31,34,71,0.10);
        --ink-30:rgba(31,34,71,0.30);
        --overlay:rgba(31,34,71,0.30);
        --portrait-bg:#1F2247;
      }

      /* ---------- WARM HERITAGE · DARK (espresso & terracotta) ---------- */
      .theme-dark{
        --bg:#1A130D;
        --surface:#241A12;
        --panel:#2C2016;
        --heading:#F3E6CE;
        --heading-hover:#FFF3DC;
        --ink:#E4D6C1;
        --body:#CBBCA4;
        --muted2:#B3A488;
        --muted:#9A8C74;
        --placeholder:#8A7C66;
        --accent:#E07647;
        --accent-deep:#C1502E;
        --gold:#E9C46A;
        --skeleton:#2E2118;
        --disabled:#5E4636;
        --ok-bg:#22301E;  --ok-fg:#A9C99A;
        --err-bg:#3A211A; --err-fg:#E8A48C;
        --footer-bg:#120C08; --footer-text:#C9B89E; --footer-name:#E9C46A;
        --nav-bg:rgba(26,19,13,0.85);
        --line:rgba(224,118,71,0.26);
        --line2:rgba(224,118,71,0.18);
        --line3:rgba(224,118,71,0.32);
        --line-input:rgba(224,118,71,0.34);
        --accent-45:rgba(224,118,71,0.45);
        --accent-10:rgba(224,118,71,0.12);
        --line-ink:rgba(243,230,206,0.12);
        --ink-30:rgba(243,230,206,0.28);
        --overlay:rgba(10,7,4,0.55);
        --portrait-bg:#0E0A06;
      }
    `}</style>
  );
}
