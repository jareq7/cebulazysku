// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OfferFAQProps {
  faq: { question: string; answer: string }[];
}

export function OfferFAQ({ faq }: OfferFAQProps) {
  if (faq.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Najczęściej zadawane pytania</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
