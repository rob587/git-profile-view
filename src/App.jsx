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
    <>
      {loading && <p>Caricamento...</p>}
      {error && <p>{error}</p>}

      <h1>Git Profile Finder</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />

      <button onClick={() => fetchProfile()}>Cerca</button>

      <p>hai cercato: {inputValue}</p>

      {profileDatas && (
        <div>
          <img
            src={profileDatas.avatar_url}
            alt={profileDatas.name}
            width={100}
          />
          <a href={profileDatas.html_url} target="_blank">
            Vedi profilo
          </a>
          {profileDatas.name} , {profileDatas.bio}, {profileDatas.followers},
          {profileDatas.public_repos}
        </div>
      )}

      {repos.length > 0 && (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank">
                {repo.name}
              </a>
              {repo.description}, {repo.language},{repo.stargazers_count}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
