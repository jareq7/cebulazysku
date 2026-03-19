// @author Claude Code (claude-opus-4-6) | 2026-03-19
"use client";

import { homepageFaq } from "@/data/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function HomepageFaq() {
  const mid = Math.ceil(homepageFaq.length / 2);
  const leftCol = homepageFaq.slice(0, mid);
  const rightCol = homepageFaq.slice(mid);

  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Najczęstsze pytania</h2>
          <p className="mt-3 text-muted-foreground">
            Wszystko co musisz wiedzieć o premiach bankowych
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2">
          <Accordion type="multiple">
            {leftCol.map((item, i) => (
              <AccordionItem key={i} value={`faq-left-${i}`}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Accordion type="multiple">
            {rightCol.map((item, i) => (
              <AccordionItem key={i} value={`faq-right-${i}`}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
