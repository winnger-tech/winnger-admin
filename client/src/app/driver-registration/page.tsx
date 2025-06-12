"use client";

import DriverRegistration from '@/components/driver/DriverRegistration';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function DriverRegistrationPage() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Add any additional handling here
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>Driver Registration</PageTitle>
        <PageDescription>
          Join our network of professional drivers and start earning on your own schedule.
          Fill out the form below to begin your registration process.
        </PageDescription>
        {/*<DriverRegistration onSubmit={handleSubmit} />*/}

        <Elements stripe={stripePromise}>
          <DriverRegistration onSubmit={handleSubmit} />
        </Elements>
      </ContentWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  background-color: #403E2D;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const PageDescription = styled.p`
  font-size: 1.125rem;
  color: #e0e0e0;
  margin-bottom: 3rem;
  line-height: 1.6;
`;