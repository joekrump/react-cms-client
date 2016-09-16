import React from 'react';
import PaymentContent from '../Partials/PaymentContent';
import FrontendLayout from '../../../Layout/FrontendLayout'

const DonationPage = (props) => (
  <FrontendLayout>
    <h1>Donation Page</h1>
    <PaymentContent {...props}/>
  </FrontendLayout>
);

export default DonationPage;