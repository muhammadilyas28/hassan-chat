export default function Home() {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>🚀 Welcome to NextNestAuth</h1>
        <p>
          This is the home page. Try visiting:
        </p>
        <ul>
          <li><a href="/signup">/signup</a> - to create a new account</li>
          <li><a href="/login">/login</a> - to log in</li>
        </ul>
      </div>
    );
  }
  