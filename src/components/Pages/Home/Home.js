import React from 'react';
import { Link } from 'react-router'
import FrontendLayout from '../../Layout/FrontendLayout'

const Home = () => {
  return (
    <FrontendLayout>
      <div className="homepage">
        <h1>Wecome Home!</h1>
        <p>This is the homepage</p>
        <p>If you'd like to access admin go to the <Link to="/login">log in page</Link>.</p>
      </div>
    </FrontendLayout>
  );
};
export default Home;