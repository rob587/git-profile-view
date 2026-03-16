// Profilo utente
// https://api.github.com/users/USERNAME

import { useState } from "react";

// Repository dell'utente
// https://api.github.com/users/USERNAME/repos?sort=updated&per_page=6

function App() {
  const [inputValue, setInputValue] = useState("");
  const [profileDatas, setProfileDatas] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProfile() {
    const userFetch = fetch(`https://api.github.com/users/${inputValue}`);
    const userRepos = fetch(
      `https://api.github.com/users/${inputValue}/repos?sort=updated&per_page=6`,
    );

    const [userResponse, userReposResponse] = await Promise.all([
      userFetch,
      userRepos,
    ]);

    const [profileData, reposData] = await Promise.all([
      userResponse.json(),
      userReposResponse.json(),
    ]);
  }

  return (
    <>
      <h1>Git Profile Finder</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </>
  );
}

export default App;
