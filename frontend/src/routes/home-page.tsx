import './home-page.scss';

export function HomePage() {
  return (
    <div className="home-panel">
      <h1>Welcome to <em>Spotify BlindTest Learner</em> App</h1>
      <p>Here you can train yourself to recognize your favorite music by linking this app to your <a href="https://open.spotify.com">Spotify</a> account.</p>
      <p>Please login if you wish to continue using this app.</p>
    </div>
  );
}
