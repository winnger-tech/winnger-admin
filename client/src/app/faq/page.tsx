"use client"

import styled from 'styled-components';
import { Plus, Minus } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const faqs = [
  {
    question: "Who can register on this platform?",
    answer:
      "Our platform is designed for both delivery drivers looking to earn flexibly and restaurants aiming to expand their delivery reach.",
  },
  {
    question: "What documents do I need to upload while registering?",
    answer: "Drivers typically need to provide a valid ID, driving license, and vehicle details. Restaurants may need a business license and menu information.",
  },
  {
    question: "Is there any registration fee?",
    answer: "Yes, there's a one-time setup fee to help us verify your details and onboard you securely. No hidden charges after that!",
  },
  {
    question: "How long does the approval process take?",
    answer: "Once your form and payment are submitted, our admin team will review and approve your registration within 24–48 hours.",
  },
  {
    question: "I own multiple restaurants. Can I register them all?",
    answer: "Absolutely! You can register each outlet individually or contact our support team for bulk onboarding options.",
  },
  {
    question: "What kind of support do you provide after onboarding?",
    answer: "We offer partner support, including marketing help, logistics integration, and ongoing assistance via phone and email.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <FaqContainer id='faqs'
      as={motion.div}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Title>Frequently Asked Questions</Title>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <AccordionItem key={index} active={isOpen} onClick={() => toggle(index)}>
            <Question>
              {faq.question}
              {isOpen ? (
                <Minus color="white" strokeWidth={2.5} />
              ) : (
                <Plus color="white" strokeWidth={2.5} />
              )}
            </Question>
            {isOpen && <Answer>{faq.answer}</Answer>}
          </AccordionItem>
        );
      })}
    </FaqContainer>
  );
};

export default FaqSection;

// Styled Components
const FaqContainer = styled.div`
  padding: 40px 24px;
  margin: 0 80px;

  @media (max-width: 1024px) {
    margin: 0 40px;
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

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 24px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 2rem;
    white-space: normal;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const AccordionItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  background-color: #949280;
  color: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0px 4px 0px 0px #000000;
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid white;
  transition: all 0.3s ease;

  &:hover {
    background-color: #777565;
  }

  @media (max-width: 480px) {
    padding: 18px;
  }
`;

const Question = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const Answer = styled.div`
  margin-top: 16px;
  font-size: 14px;
  border-top: 1px solid white;
  padding-top: 12px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;
