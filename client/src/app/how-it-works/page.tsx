'use client';

import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '0px 0px -100px 0px' });

  return (
    <Section ref={sectionRef} id='how-it-works'>
      <ContentWrapper>
        <MotionDiv $isInView={isInView}>
          {/* Heading Section */}
          <InlineHeadingWrapper>
            <Heading>How It Works</Heading>
            <SubHeading>
              Get started in just 3 simple steps. Whether you’re a <Highlight>driver</Highlight> or a <Highlight>restaurant</Highlight>,
              joining our platform is quick, secure, and hassle-free.
            </SubHeading>
          </InlineHeadingWrapper>

          {/* Steps Section */}
          <StepsBox>
            <Step>
              <strong>Step 1:</strong>
              <strong>Fill Out a Simple Form</strong>
              <p>Provide your details and necessary documents</p>
            </Step>
            <Step>
              <strong>Step 2:</strong>
              <strong>Pay the One-Time Setup Fee</strong>
              <p>Secure payment gateway ensures your registration is verified</p>
            </Step>
            <Step>
              <strong>Step 3:</strong>
              <strong>Get Approved by Admin</strong>
              <p>Once approved, you’ll receive an onboarding confirmation</p>
            </Step>
          </StepsBox>

          {/* CTA Section */}
          <CTAContainer>
            <InlineHeadingWrapper>
              <Heading>Ready to Get Started?</Heading>
              <RightColumn>
                <SubHeading>
                  Join hundreds of drivers and restaurants pre-registering today.
                </SubHeading>
                <CTAButtons>
                  <Button href="/driver-registration">Register as Driver</Button>
                  <Button href="/restaurant-registration">Register as Restaurant</Button>
                </CTAButtons>
              </RightColumn>
            </InlineHeadingWrapper>
          </CTAContainer>
        </MotionDiv>
      </ContentWrapper>
    </Section>
  );
}

// Styled Components

const Section = styled.section`
  font-family: 'Space Grotesk', sans-serif;
  margin-bottom: -100px;


  @media (max-width: 1024px) {
    padding: 4rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const MotionDiv = styled(motion.div)<{ $isInView: boolean }>`
  opacity: ${({ $isInView }) => ($isInView ? 1 : 0)};
  transform: ${({ $isInView }) => ($isInView ? 'none' : 'translateY(50px)')};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const InlineHeadingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 2rem;
    white-space: normal;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SubHeading = styled.p`
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #e0e0e0;
  max-width: 800px;
  text-align: left;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Highlight = styled.span`
  color: white;
  font-weight: 600;
`;

const StepsBox = styled.div`
  background-color: #d6c2a1;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 3rem;
  }
`;

const Step = styled.div`
  flex: 1;
  font-size: 1rem;
  line-height: 1.625rem;
  color: #000;

  strong {
    display: block;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #00000033;
    padding-bottom: 1.5rem;

    @media (min-width: 768px) {
      border-bottom: none;
      border-right: 1px solid #00000033;
      padding-right: 2rem;
    }
  }
`;

const CTAContainer = styled.div`
  padding: 6rem 0;

  @media (max-width: 1024px) {
    padding: 4rem 0;
  }

  @media (max-width: 480px) {
    padding: 3rem 0;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 700px;
`;

const CTAButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.a`
  background-color: #f7b22c;
  color: black;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e0a600;
  }

  @media (max-width: 480px) {
    width: 100%;
    text-align: center;
  }
`;
