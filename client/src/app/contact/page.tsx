'use client';

import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const ContactSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <Container id='contact'
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <InlineHeadingWrapper>
        <Heading>Contact Us</Heading>
        <SubHeading>
          Have Questions? Get in Touch!
          We're here to help. Fill out the form below and we'll get back to you shortly.
        </SubHeading>
      </InlineHeadingWrapper>
      <Decoration />
      <ContactBox>
        <Form>
          <InputWrapper>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Name" />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="email">Email*</Label>
            <Input id="email" type="email" placeholder="Email" required />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="message">Message*</Label>
            <TextArea id="message" placeholder="Message" required />
          </InputWrapper>
          <Button type="submit">Send Message</Button>
        </Form>
      </ContactBox>
    </Container>
  );
};

export default ContactSection;

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

// Styled Components

const Container = styled(motion.section)`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px 24px;
  margin: 0 80px;
  position: relative;
  overflow: visible;

  @media (max-width: 1024px) {
    margin: 0 40px;
    padding: 36px 20px;
  }

  @media (max-width: 768px) {
    margin: 0 24px;
    padding: 32px 16px;
  }

  @media (max-width: 480px) {
    margin: 0 16px;
    padding: 24px 12px;
  }
`;

const InlineHeadingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1rem;

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
    text-align: left;
  }
`;

const ContactBox = styled.div`
  background-color: #949280;
  padding: 48px 32px 48px 80px;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  overflow: visible;

  @media (max-width: 1024px) {
    padding-left: 64px;
  }

  @media (max-width: 768px) {
    padding: 40px 28px 40px 28px;
  }

  @media (max-width: 480px) {
    padding: 32px 24px 32px 24px;
    border-radius: 22.5px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 550px;
  z-index: 2;

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
`;

const Input = styled.input`
  background-color: #706c51;
  border: 1px solid white;
  padding: 12px 16px;
  border-radius: 12px;
  color: white;
  font-size: 14px;

  &::placeholder {
    color: #d6d6d6;
  }
`;

const TextArea = styled.textarea`
  background-color: #6c6a4b;
  border: 1px solid white;
  padding: 12px 16px;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  resize: none;
  min-height: 140px;

  &::placeholder {
    color: #d6d6d6;
  }
`;

const Button = styled.button`
  background-color: #ffc32b;
  color: black;
  border: none;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  width: 100%;
  max-width: full;
  transition: background 0.3s ease;

  &:hover {
    background-color: #e6ac00;
  }
`;

const Decoration = styled.div`
  position: absolute;
  bottom: 50px;
  right: -14vw;
  width: 50vw;
  height: 50vw;
  max-width: 500px;
  max-height: 500px;
  background: url('/decor.svg') no-repeat center center;
  background-size: contain;
  pointer-events: none;
  z-index: 1;


`;
