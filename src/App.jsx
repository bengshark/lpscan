import { useState, useEffect, useRef } from "react";

const RISK_LEVELS = {
  good: { label: "Low Risk", color: "#00e599", bg: "rgba(0,229,153,0.1)", icon: "🟢" },
  warn: { label: "Medium Risk", color: "#E8A317", bg: "rgba(232,163,23,0.1)", icon: "🟡" },
  danger: { label: "High Risk", color: "#ff4757", bg: "rgba(255,71,87,0.1)", icon: "🔴" },
  unknown: { label: "Unknown", color: "#888", bg: "rgba(136,136,136,0.1)", icon: "⚪" },
};

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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "#666", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: color || "#fff", fontFamily: "'Space Mono', monospace", wordBreak: "break-all" }}>
            {value}
          </div>
          {subValue && (
            <div style={{ fontSize: 11, color: "#555", marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>
              {subValue}
            </div>
          )}
        </div>
        <div style={{ fontSize: 24, opacity: 0.6, marginLeft: 12, flexShrink: 0 }}>{icon}</div>
      </div>
    </div>
  );
}

function RiskBadge({ level, risks, score }) {
  const config = RISK_LEVELS[level] || RISK_LEVELS.unknown;
  return (
    <div style={{
      background: config.bg, border: `1px solid ${config.color}33`,
      borderRadius: 12, padding: "20px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{config.icon}</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: config.color, fontFamily: "'Space Mono', monospace" }}>
            {config.label}
          </span>
        </div>
        {score !== null && (
          <span style={{ fontSize: 14, color: config.color, fontFamily: "'JetBrains Mono', monospace" }}>
            Score: {score}/1000
          </span>
        )}
      </div>
      {risks && risks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {risks.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              fontSize: 12, color: "#999", fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{ color: r.safe ? "#00e599" : "#ff4757", fontSize: 10, marginTop: 3, flexShrink: 0 }}>
                {r.safe ? "✓" : "✗"}
              </span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HolderBar({ rank, percentage, address, isAmm, label }) {
  const barColor = isAmm
    ? "rgba(88,101,242,0.4), rgba(88,101,242,0.1)"
    : "rgba(0,229,153,0.4), rgba(0,229,153,0.1)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: "#555", width: 24, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
        #{rank}
      </span>
      <div style={{ flex: 1, height: 22, background: "rgba(255,255,255,0.03)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", width: `${Math.min(percentage * 2, 100)}%`,
          background: `linear-gradient(90deg, ${barColor})`,
          borderRadius: 4, transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
        <div style={{
          position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {label && (
            <span style={{
              fontSize: 9, color: isAmm ? "#5865F2" : "#00e599",
              fontFamily: "'JetBrains Mono', monospace",
              background: isAmm ? "rgba(88,101,242,0.15)" : "rgba(0,229,153,0.15)",
              padding: "1px 5px", borderRadius: 3,
            }}>
              {label}
            </span>
          )}
        </div>
        <span style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          fontSize: 10, color: "#888", fontFamily: "'JetBrains Mono', monospace",
        }}>
          {percentage.toFixed(2)}%
        </span>
      </div>
      <span style={{ fontSize: 10, color: "#444", fontFamily: "'JetBrains Mono', monospace", width: 90, overflow: "hidden", textOverflow: "ellipsis", flexShrink: 0 }}>
        {address}
      </span>
    </div>
  );
}

function formatUsd(val) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`;
  return `$${val.toFixed(2)}`;
}

function formatPrice(val) {
  if (!val || val === 0) return "$0";
  if (val < 0.000001) return `$${val.toExponential(2)}`;
  if (val < 0.01) return `$${val.toFixed(8)}`;
  if (val < 1) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(2)}`;
}

export default function LPScan() {
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
      await addScanLine(`Target: ${addr.slice(0, 8)}...${addr.slice(-6)}`, 300);
      await addScanLine("Fetching full report from RugCheck...", 600);

      let data = null;
      try {
        const res = await fetch(`https://api.rugcheck.xyz/v1/tokens/${addr}/report`);
        if (res.ok) {
          data = await res.json();
        } else {
          throw new Error(`RugCheck returned ${res.status}`);
        }
      } catch (e) {
        console.error("RugCheck error:", e);
        setError("Token not found or RugCheck API error. Check the CA and try again.");
        setLoading(false);
        return;
      }

      await addScanLine("Parsing token metadata...", 900);
      await addScanLine("Analyzing holder distribution...", 1200);
      await addScanLine("Detecting launch platform...", 1500);
      await addScanLine("Evaluating risk signals...", 1800);

      const tokenName = data.tokenMeta?.name || "Unknown";
      const tokenSymbol = data.tokenMeta?.symbol || "???";
      const price = data.price || 0;
      const totalHolders = data.totalHolders || 0;
      const totalLiquidity = data.totalMarketLiquidity || 0;
      const rugged = data.rugged || false;

      let launchPlatform = { name: "Unknown", color: "#888", icon: "❓" };
      if (data.launchpad) {
        const lp = data.launchpad;
        const platform = (lp.platform || lp.name || "").toLowerCase();
        if (platform.includes("pump")) {
          launchPlatform = { name: lp.name || "Pump.fun", color: "#00e599", icon: "🚀" };
        } else if (platform.includes("raydium")) {
          launchPlatform = { name: lp.name || "Raydium", color: "#5865F2", icon: "⚡" };
        } else if (platform.includes("meteora")) {
          launchPlatform = { name: lp.name || "Meteora", color: "#E8A317", icon: "☄️" };
        } else if (platform.includes("moonshot")) {
          launchPlatform = { name: lp.name || "Moonshot", color: "#9b59b6", icon: "🌙" };
        } else if (platform.includes("orca")) {
          launchPlatform = { name: lp.name || "Orca", color: "#FFD700", icon: "🌊" };
        } else {
          launchPlatform = { name: lp.name || platform, color: "#888", icon: "📦" };
        }
      } else if (data.markets && data.markets.length > 0) {
        for (const m of data.markets) {
          const mt = (m.marketType || "").toLowerCase();
          if (mt.includes("pump")) { launchPlatform = { name: "Pump.fun", color: "#00e599", icon: "🚀" }; break; }
          if (mt.includes("raydium")) { launchPlatform = { name: "Raydium", color: "#5865F2", icon: "⚡" }; break; }
          if (mt.includes("meteora")) { launchPlatform = { name: "Meteora", color: "#E8A317", icon: "☄️" }; break; }
          if (mt.includes("orca")) { launchPlatform = { name: "Orca", color: "#FFD700", icon: "🌊" }; break; }
        }
      }

      const score = data.score || 0;
      let riskLevel = "unknown";
      if (rugged) riskLevel = "danger";
      else if (score >= 500) riskLevel = "good";
      else if (score >= 200) riskLevel = "warn";
      else riskLevel = "danger";

      let risks = [];
      if (data.risks && data.risks.length > 0) {
        risks = data.risks.map(r => ({
          label: r.name || r.description || "Unknown risk",
          safe: r.level === "none" || r.level === "info",
        }));
      }
      risks.push({ label: `Mint authority: ${data.mintAuthority ? "Enabled" : "Disabled"}`, safe: !data.mintAuthority });
      risks.push({ label: `Freeze authority: ${data.freezeAuthority ? "Enabled" : "Disabled"}`, safe: !data.freezeAuthority });
      if (rugged) risks.unshift({ label: "TOKEN IS RUGGED", safe: false });

      const knownAccounts = data.knownAccounts || {};
      const topHolders = (data.topHolders || []).slice(0, 10).map((h, i) => {
        const ownerInfo = knownAccounts[h.owner] || knownAccounts[h.address] || null;
        const isAmm = ownerInfo?.type === "AMM";
        return {
          rank: i + 1,
          percentage: h.pct || 0,
          address: h.owner || h.address || "unknown",
          uiAmount: h.uiAmount || 0,
          isAmm,
          label: ownerInfo?.name || null,
        };
      });

      const nonAmmHolders = topHolders.filter(h => !h.isAmm);
      const avgHoldingValue = nonAmmHolders.length > 0
        ? nonAmmHolders.reduce((sum, h) => sum + (h.uiAmount * price), 0) / nonAmmHolders.length
        : 0;
      const totalTop10Pct = topHolders.reduce((s, h) => s + h.percentage, 0);
      const nonAmmTop10Pct = nonAmmHolders.reduce((s, h) => s + h.percentage, 0);

      const markets = (data.markets || []).map(m => ({
        type: m.marketType || "unknown",
        liquidity: (m.lp?.quoteUSD || 0) * 2,
      }));

      await addScanLine("✓ Scan complete.", 2100);

      setResult({
        tokenName, tokenSymbol, address: addr, price, totalHolders, totalLiquidity, rugged,
        rugScore: score, riskLevel, risks, topHolders, nonAmmHolders, avgHoldingValue,
        totalTop10Pct, nonAmmTop10Pct, launchPlatform, markets,
        lpLockedPct: data.lpLockedPct || null,
      });
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
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        input::placeholder { color: #333; }
        input:focus { outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
      `}</style>

      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 20% 0%, rgba(0,229,153,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(88,101,242,0.03) 0%, transparent 60%)",
      }} />

      {loading && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #00e599, transparent)",
          animation: "scanline 1.5s linear infinite", pointerEvents: "none", zIndex: 100,
        }} />
      )}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px", position: "relative" }}>
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

        {error && (
          <div style={{
            background: "rgba(255,71,87,0.08)", border: "1px solid rgba(255,71,87,0.2)",
            borderRadius: 10, padding: "14px 18px", marginBottom: 24,
            fontSize: 13, color: "#ff4757",
          }}>
            {error}
          </div>
        )}

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

        {result && (
          <div style={{ animation: "fadeInUp 0.5s ease forwards" }}>
            {result.rugged && (
              <div style={{
                background: "rgba(255,71,87,0.15)", border: "2px solid #ff4757",
                borderRadius: 12, padding: "16px 20px", marginBottom: 16,
                textAlign: "center", fontSize: 16, fontWeight: 700, color: "#ff4757",
                fontFamily: "'Space Mono', monospace",
              }}>
                ⚠️ THIS TOKEN HAS BEEN RUGGED ⚠️
              </div>
            )}

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 16, padding: "16px 20px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "'Space Mono', monospace" }}>
                  {result.tokenName}
                </div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
                  ${result.tokenSymbol}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#00e599", fontFamily: "'Space Mono', monospace" }}>
                  {formatPrice(result.price)}
                </div>
                <div style={{ fontSize: 11, color: "#444", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                  {result.totalHolders.toLocaleString()} holders
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <StatCard
                label="Launch Platform"
                value={result.launchPlatform.name}
                subValue={result.markets.length > 0 ? `${result.markets.length} pool${result.markets.length > 1 ? "s" : ""} active` : "No active pools"}
                icon={result.launchPlatform.icon}
                color={result.launchPlatform.color}
                delay={100}
              />
              <StatCard
                label="Total Liquidity"
                value={formatUsd(result.totalLiquidity)}
                subValue={result.lpLockedPct ? `${result.lpLockedPct.toFixed(1)}% LP locked` : "LP lock data N/A"}
                icon="💧"
                color="#5865F2"
                delay={200}
              />
              <StatCard
                label="Top 10 Concentration"
                value={`${result.totalTop10Pct.toFixed(1)}%`}
                subValue={`${result.nonAmmTop10Pct.toFixed(1)}% excl. AMM pools`}
                icon="👥"
                color={result.nonAmmTop10Pct > 30 ? "#ff4757" : result.nonAmmTop10Pct > 15 ? "#E8A317" : "#00e599"}
                delay={300}
              />
              <StatCard
                label="Avg Top Holder Value"
                value={result.avgHoldingValue > 0 ? formatUsd(result.avgHoldingValue) : "N/A"}
                subValue={result.nonAmmHolders.length > 0 ? `Avg across ${result.nonAmmHolders.length} non-AMM holders` : "No holder data"}
                icon="💰"
                color="#E8A317"
                delay={400}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <RiskBadge level={result.riskLevel} risks={result.risks} score={result.rugScore} />
            </div>

            {result.topHolders.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "20px 24px", marginBottom: 12,
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 16,
                }}>
                  <div style={{
                    fontSize: 12, color: "#555", letterSpacing: 1.2, textTransform: "uppercase",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    Top Holder Distribution
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 10, color: "#00e599", fontFamily: "'JetBrains Mono', monospace" }}>● Holder</span>
                    <span style={{ fontSize: 10, color: "#5865F2", fontFamily: "'JetBrains Mono', monospace" }}>● AMM/Pool</span>
                  </div>
                </div>
                {result.topHolders.map((h) => (
                  <HolderBar
                    key={h.rank}
                    rank={h.rank}
                    percentage={h.percentage}
                    address={h.address.slice(0, 6) + "..." + h.address.slice(-4)}
                    isAmm={h.isAmm}
                    label={h.label}
                  />
                ))}
                <div style={{
                  marginTop: 12, padding: "10px 12px",
                  background: "rgba(255,255,255,0.02)", borderRadius: 8,
                  fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono', monospace",
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span>Top 10 total: {result.totalTop10Pct.toFixed(2)}%</span>
                  <span>Wallets only: {result.nonAmmTop10Pct.toFixed(2)}%</span>
                </div>
              </div>
            )}

            {result.markets.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "16px 24px", marginBottom: 12,
              }}>
                <div style={{
                  fontSize: 12, color: "#555", letterSpacing: 1.2, textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: 12,
                }}>
                  Active Markets
                </div>
                {result.markets.map((m, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: i < result.markets.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  }}>
                    <span style={{ fontSize: 12, color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>
                      {m.type.replace(/_/g, " ")}
                    </span>
                    <span style={{ fontSize: 12, color: "#00e599", fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatUsd(m.liquidity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "RugCheck", url: `https://rugcheck.xyz/tokens/${result.address}` },
                { label: "Birdeye", url: `https://birdeye.so/token/${result.address}?chain=solana` },
                { label: "Solscan", url: `https://solscan.io/token/${result.address}` },
                { label: "DexScreener", url: `https://dexscreener.com/solana/${result.address}` },
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

        {!result && !loading && !error && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>◎</div>
            <div style={{ fontSize: 13, color: "#333" }}>
              Paste a Solana token CA above to scan
            </div>
            <div style={{ fontSize: 11, color: "#222", marginTop: 8 }}>
              Powered by RugCheck API
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
