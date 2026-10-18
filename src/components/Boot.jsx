import { useEffect, useState } from "react";

// First-paint brand splash. Plays on every fresh page load, then fades.
// (Route changes don't remount the app, so in-app navigation never replays it.)
const Boot = () => {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1900);
    const t2 = setTimeout(() => setGone(true), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div className={`boot ${leaving ? "leaving" : ""}`} aria-hidden="true">
      <div className="bloom">
        {[...Array(8)].map((_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
        <em className="bloom-core">C</em>
      </div>
      <h1 className="boot-word">
        {"CHATAKH".split("").map((ch, i) => (
          <b key={i} style={{ "--d": `${i * 70}ms` }}>{ch}</b>
        ))}
      </h1>
      <p className="boot-tag">born to stand out</p>
      <div className="boot-bar"><i /></div>
    </div>
  );
};

export default Boot;
