// Profilo utente
// https://api.github.com/users/USERNAME

import { useEffect, useState } from "react";

// Repository dell'utente
// https://api.github.com/users/USERNAME/repos?sort=updated&per_page=6

function App() {
  const [inputValue, setInputValue] = useState("");
  const [profileDatas, setProfileDatas] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProfile(providedUser = null) {
    const userToSearch = (providedUser || inputValue).trim();
    try {
      setLoading(true);
      setError(null);
      const userFetch = fetch(`https://api.github.com/users/${userToSearch}`);
      const userRepos = fetch(
        `https://api.github.com/users/${userToSearch}/repos?sort=updated&per_page=6`,
      );
      const [userResponse, userReposResponse] = await Promise.all([
        userFetch,
        userRepos,
      ]);

      if (!userResponse.ok || !userReposResponse.ok)
        throw new Error("Utente non trovato");

      const [profileData, reposData] = await Promise.all([
        userResponse.json(),
        userReposResponse.json(),
      ]);
      localStorage.setItem("lastUser", userToSearch);
      setProfileDatas(profileData);
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("lastUser");
    if (savedUser) {
      setInputValue(savedUser);
      fetchProfile(savedUser);
    }
  }, []);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "sans-serif",
        color: "#24292f",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        🐙 GitHub Profile Finder
      </h1>

      {/* Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <input
          type="text"
          value={inputValue}
          placeholder="Es. torvalds, gaearon..."
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchProfile()}
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: "16px",
            border: "1px solid #d0d7de",
            borderRadius: "8px",
            outline: "none",
          }}
        />
        <button
          onClick={() => fetchProfile()}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: "#2da44e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cerca
        </button>
      </div>

      {/* Stati */}
      {loading && <p style={{ color: "#666" }}>⏳ Caricamento...</p>}
      {error && <p style={{ color: "#cf222e" }}>❌ {error}</p>}

      {/* Profilo */}
      {profileDatas && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            padding: "20px",
            border: "1px solid #d0d7de",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <img
            src={profileDatas.avatar_url}
            alt={profileDatas.name}
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
          />
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "20px" }}>
              {profileDatas.name}
            </h2>
            <p style={{ margin: "0 0 8px", color: "#666", fontSize: "14px" }}>
              {profileDatas.bio}
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                fontSize: "14px",
                color: "#444",
              }}
            >
              <span>👥 {profileDatas.followers} followers</span>
              <span>📦 {profileDatas.public_repos} repo</span>
            </div>
            <a
              href={profileDatas.html_url}
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: "10px",
                fontSize: "14px",
                color: "#0969da",
                textDecoration: "none",
              }}
            >
              Vedi profilo →
            </a>
          </div>
        </div>
      )}

      {/* Repo */}
      {repos.length > 0 && (
        <div>
          <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#666" }}>
            Ultimi repository
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {repos.map((repo) => (
              <li
                key={repo.id}
                style={{
                  padding: "14px",
                  border: "1px solid #d0d7de",
                  borderRadius: "8px",
                }}
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  style={{
                    fontWeight: "bold",
                    color: "#0969da",
                    textDecoration: "none",
                    fontSize: "15px",
                  }}
                >
                  {repo.name}
                </a>
                <p
                  style={{
                    margin: "6px 0",
                    fontSize: "13px",
                    color: "#666",
                    minHeight: "36px",
                  }}
                >
                  {repo.description || "Nessuna descrizione"}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "13px",
                    color: "#444",
                  }}
                >
                  {repo.language && <span>🔵 {repo.language}</span>}
                  <span>⭐ {repo.stargazers_count}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
