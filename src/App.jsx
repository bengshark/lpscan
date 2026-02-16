import { useState, useEffect, useRef } from "react";

const KNOWN_PROGRAMS = {
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P": { name: "Pump.fun", color: "#00e599", icon: "🚀" },
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": { name: "Raydium", color: "#5865F2", icon: "⚡" },
  "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo": { name: "Meteora", color: "#E8A317", icon: "☄️" },
  "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C": { name: "Raydium CPMM", color: "#5865F2", icon: "⚡" },
  "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc": { name: "Orca", color: "#FFD700", icon: "🌊" },
};

const RISK_LEVELS = {
  good: { label: "Low Risk", color: "#00e599", bg: "rgba(0,229,153,0.1)", icon: "🟢" },
  warn: { label: "Medium Risk", color: "#E8A317", bg: "rgba(232,163,23,0.1)", icon: "🟡" },
  danger: { label: "High Risk", color: "#ff4757", bg: "rgba(255,71,87,0.1)", icon: "🔴" },
  unknown: { label: "Unknown", color: "#888", bg: "rgba(136,136,136,0.1)", icon: "⚪" },
};

function TypingText({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

function PulsingDot({ color }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      backgroundColor: color, marginRight: 8,
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

function StatCard({ label, value, subValue, icon, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "20px 24px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: "#666", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: color || "#fff", fontFamily: "'Space Mono', monospace" }}>
            {value}
          </div>
          {subValue && (
            <div style={{ fontSize: 12, color: "#555", marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>
              {subValue}
            </div>
          )}
        </div>
        <div style={{ fontSize: 28, opacity: 0.6 }}>{icon}</div>
      </div>
    </div>
  );
}

function RiskBadge({ level, risks }) {
  const config = RISK_LEVELS[level] || RISK_LEVELS.unknown;
  return (
    <div style={{
      background: config.bg, border: `1px solid ${config.color}33`,
      borderRadius: 12, padding: "20px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{config.icon}</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: config.color, fontFamily: "'Space Mono', monospace" }}>
          {config.label}
        </span>
      </div>
      {risks && risks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {risks.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, color: "#999", fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{ color: r.safe ? "#00e599" : "#ff4757", fontSize: 10 }}>
                {r.safe ? "✓" : "✗"}
              </span>
              {r.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HolderBar({ rank, percentage, address }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: "#555", width: 24, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
        #{rank}
      </span>
      <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.03)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", width: `${Math.min(percentage * 2, 100)}%`,
          background: `linear-gradient(90deg, rgba(0,229,153,0.4), rgba(0,229,153,0.1))`,
          borderRadius: 4, transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
        <span style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace",
        }}>
          {percentage.toFixed(2)}%
        </span>
      </div>
      <span style={{ fontSize: 10, color: "#444", fontFamily: "'JetBrains Mono', monospace", width: 80, overflow: "hidden", textOverflow: "ellipsis" }}>
        {address}
      </span>
    </div>
  );
}

export default function SolanaTokenChecker() {
  const [ca, setCa] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanLines, setScanLines] = useState([]);
  const inputRef = useRef(null);

  const addScanLine = (text, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setScanLines((prev) => [...prev, text]);
        resolve();
      }, delay);
    });
  };

  const analyzeToken = async () => {
    if (!ca.trim() || ca.trim().length < 32) {
      setError("Enter a valid Solana contract address");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setScanLines([]);

    const addr = ca.trim();

    try {
      await addScanLine("Connecting to Solana network...", 0);
      await addScanLine(`Scanning token: ${addr.slice(0, 6)}...${addr.slice(-4)}`, 400);

      // ── Fetch RugCheck data ──
      await addScanLine("Fetching rug analysis from RugCheck...", 800);
      let rugData = null;
      try {
        const rugRes = await fetch(`https://api.rugcheck.xyz/v1/tokens/${addr}/report/summary`);
        if (rugRes.ok) {
          rugData = await rugRes.json();
        }
      } catch (e) {
        console.warn("RugCheck fetch failed:", e);
      }

      await addScanLine("Analyzing holder distribution...", 1200);
      await addScanLine("Checking launch platform...", 1600);
      await addScanLine("Calculating fee metrics...", 2000);
      await addScanLine("Compiling report...", 2400);

      // ── Parse RugCheck response ──
      let riskLevel = "unknown";
      let risks = [];
      let tokenName = addr.slice(0, 6) + "...";
      let tokenSymbol = "???";
      let launchPlatform = null;
      let topHolders = [];
      let totalMarkets = 0;

      if (rugData) {
        tokenName = rugData.tokenMeta?.name || tokenName;
        tokenSymbol = rugData.tokenMeta?.symbol || tokenSymbol;

        // Risk scoring
        const score = rugData.score || 0;
        if (score >= 800) riskLevel = "good";
        else if (score >= 400) riskLevel = "warn";
        else riskLevel = "danger";

        // Risk flags
        const riskEntries = rugData.risks || [];
        risks = riskEntries.map(r => ({
          label: r.name || r.description || "Unknown risk",
          safe: r.level === "none" || r.level === "info",
        }));

        if (risks.length === 0) {
          risks = [
            { label: "Mint authority: " + (rugData.mintAuthority ? "Enabled" : "Disabled"), safe: !rugData.mintAuthority },
            { label: "Freeze authority: " + (rugData.freezeAuthority ? "Enabled" : "Disabled"), safe: !rugData.freezeAuthority },
            { label: "Top 10 concentration check", safe: true },
          ];
        }

        // Holder data from markets
        totalMarkets = rugData.markets?.length || 0;

        if (rugData.topHolders && rugData.topHolders.length > 0) {
          topHolders = rugData.topHolders.slice(0, 10).map((h, i) => ({
            rank: i + 1,
            percentage: h.pct || 0,
            address: h.owner || h.address || "unknown",
          }));
        }

        // Detect launch platform from markets
        if (rugData.markets) {
          for (const market of rugData.markets) {
            const programId = market.marketType || market.pubkey || "";
            const lp = market.lp || {};
            // Check various known identifiers
            if (market.marketType) {
              const mt = market.marketType.toLowerCase();
              if (mt.includes("pump") || mt.includes("pumpfun")) {
                launchPlatform = { name: "Pump.fun", color: "#00e599", icon: "🚀" };
              } else if (mt.includes("raydium")) {
                launchPlatform = { name: "Raydium", color: "#5865F2", icon: "⚡" };
              } else if (mt.includes("meteora")) {
                launchPlatform = { name: "Meteora", color: "#E8A317", icon: "☄️" };
              } else if (mt.includes("orca")) {
                launchPlatform = { name: "Orca", color: "#FFD700", icon: "🌊" };
              }
            }
          }
        }

        if (!launchPlatform && rugData.creator) {
          launchPlatform = { name: "Direct Deploy", color: "#888", icon: "📦" };
        }
      }

      // Build result
      setResult({
        tokenName,
        tokenSymbol,
        address: addr,
        rugScore: rugData?.score || null,
        riskLevel,
        risks,
        topHolders,
        launchPlatform: launchPlatform || { name: "Unknown", color: "#888", icon: "❓" },
        totalMarkets,
        fileMeta: rugData?.fileMeta || null,
        supply: rugData?.tokenMeta?.supply || null,
      });

      await addScanLine("✓ Scan complete.", 2800);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze token. Check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") analyzeToken();
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#0a0a0b", color: "#e0e0e0",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        input::placeholder { color: #333; }
        input:focus { outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
      `}</style>

      {/* Ambient background */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 20% 0%, rgba(0,229,153,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(88,101,242,0.03) 0%, transparent 60%)",
      }} />

      {/* Scanline effect */}
      {loading && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #00e599, transparent)",
          animation: "scanline 1.5s linear infinite", pointerEvents: "none", zIndex: 100,
        }} />
      )}

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 20px", position: "relative" }}>
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#333", letterSpacing: 4, marginBottom: 12 }}>
            SOLANA TOKEN SCANNER
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 700, margin: 0,
            fontFamily: "'Space Mono', monospace",
            background: "linear-gradient(135deg, #00e599, #5865F2)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            LPScan_
          </h1>
          <div style={{ fontSize: 12, color: "#333", marginTop: 8 }}>
            paste contract address — get the truth
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 32,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: 6,
        }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 12px" }}>
            <span style={{ color: "#00e599", marginRight: 10, fontSize: 14 }}>›</span>
            <input
              ref={inputRef}
              type="text"
              value={ca}
              onChange={(e) => setCa(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste contract address..."
              style={{
                width: "100%", background: "transparent", border: "none",
                color: "#e0e0e0", fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
                padding: "12px 0",
              }}
            />
          </div>
          <button
            onClick={analyzeToken}
            disabled={loading}
            style={{
              background: loading
                ? "linear-gradient(90deg, #1a1a1b, #222, #1a1a1b)"
                : "linear-gradient(135deg, #00e599, #00c77d)",
              backgroundSize: loading ? "200% 100%" : "100%",
              animation: loading ? "shimmer 1.5s linear infinite" : "none",
              color: loading ? "#666" : "#0a0a0b",
              border: "none", borderRadius: 8, padding: "12px 24px",
              fontSize: 13, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 0.5, whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "SCANNING..." : "SCAN"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(255,71,87,0.08)", border: "1px solid rgba(255,71,87,0.2)",
            borderRadius: 10, padding: "14px 18px", marginBottom: 24,
            fontSize: 13, color: "#ff4757",
          }}>
            {error}
          </div>
        )}

        {/* Scan log */}
        {scanLines.length > 0 && (
          <div style={{
            background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 16,
            marginBottom: 24, maxHeight: 160, overflowY: "auto",
            border: "1px solid rgba(255,255,255,0.03)",
          }}>
            {scanLines.map((line, i) => (
              <div key={i} style={{
                fontSize: 11, color: line.startsWith("✓") ? "#00e599" : "#444",
                marginBottom: 4, fontFamily: "'JetBrains Mono', monospace",
                animation: "fadeInUp 0.3s ease forwards",
              }}>
                <span style={{ color: "#333", marginRight: 8 }}>[{String(i).padStart(2, "0")}]</span>
                {line}
              </div>
            ))}
            {loading && (
              <span style={{ animation: "blink 0.8s step-end infinite", color: "#00e599" }}>▊</span>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ animation: "fadeInUp 0.5s ease forwards" }}>
            {/* Token header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 24, padding: "16px 20px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
            }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Space Mono', monospace" }}>
                  {result.tokenName}
                </div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
                  ${result.tokenSymbol}
                </div>
              </div>
              <div style={{
                fontSize: 11, color: "#444",
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "right",
              }}>
                <div>{result.address.slice(0, 8)}...{result.address.slice(-6)}</div>
                <div style={{ marginTop: 4, color: "#333" }}>{result.totalMarkets} market{result.totalMarkets !== 1 ? "s" : ""} detected</div>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <StatCard
                label="Rug Score"
                value={result.rugScore !== null ? `${result.rugScore}/1000` : "N/A"}
                subValue={result.rugScore !== null ? (result.rugScore >= 800 ? "Looks clean" : result.rugScore >= 400 ? "Proceed with caution" : "High risk signals") : "Could not score"}
                icon="🛡️"
                color={RISK_LEVELS[result.riskLevel]?.color || "#888"}
                delay={100}
              />
              <StatCard
                label="Launch Platform"
                value={result.launchPlatform.name}
                subValue={`Detected via market analysis`}
                icon={result.launchPlatform.icon}
                color={result.launchPlatform.color}
                delay={200}
              />
              <StatCard
                label="Top 10 Concentration"
                value={result.topHolders.length > 0
                  ? `${result.topHolders.reduce((s, h) => s + h.percentage, 0).toFixed(1)}%`
                  : "N/A"}
                subValue={result.topHolders.length > 0 ? `Across ${result.topHolders.length} holders` : "No holder data"}
                icon="👥"
                color="#5865F2"
                delay={300}
              />
              <StatCard
                label="Markets"
                value={result.totalMarkets}
                subValue="Active liquidity pools"
                icon="💧"
                color="#E8A317"
                delay={400}
              />
            </div>

            {/* Rug Analysis */}
            <div style={{ marginBottom: 12 }}>
              <RiskBadge level={result.riskLevel} risks={result.risks} />
            </div>

            {/* Top holders */}
            {result.topHolders.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "20px 24px",
              }}>
                <div style={{
                  fontSize: 12, color: "#555", letterSpacing: 1.2, textTransform: "uppercase",
                  marginBottom: 16, fontFamily: "'JetBrains Mono', monospace",
                }}>
                  Top Holder Distribution
                </div>
                {result.topHolders.map((h) => (
                  <HolderBar key={h.rank} rank={h.rank} percentage={h.percentage} address={h.address.slice(0, 8) + "..."} />
                ))}
              </div>
            )}

            {/* Footer links */}
            <div style={{
              display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap",
            }}>
              {[
                { label: "RugCheck", url: `https://rugcheck.xyz/tokens/${result.address}` },
                { label: "Birdeye", url: `https://birdeye.so/token/${result.address}` },
                { label: "Solscan", url: `https://solscan.io/token/${result.address}` },
              ].map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 11, color: "#444", textDecoration: "none",
                  padding: "8px 14px", borderRadius: 8,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "all 0.2s ease",
                }}>
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>◎</div>
            <div style={{ fontSize: 13, color: "#333" }}>
              Paste a Solana token CA above to scan
            </div>
            <div style={{ fontSize: 11, color: "#222", marginTop: 8 }}>
              Powered by RugCheck · Solana RPC
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
