import React from 'react';
import { Link } from 'react-router'

const Home = () => {
  return (
    <div className="homepage">
      <h1>Wecome Home!</h1>
      <p>This is the homepage</p>
      <p>If you'd like to access admin go to the <Link to="/login">log in page</Link>.</p>
    </div>
  );
};
export default Home;