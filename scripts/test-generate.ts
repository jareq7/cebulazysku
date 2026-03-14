import { createClient } from "@supabase/supabase-js";
import { generateOfferContent } from "../src/lib/generate-offer-content";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function main() {
  console.log("Pobieram ofertę do testowania...\n");

  const { data: offers, error } = await supabase
    .from("offers")
    .select("id, bank_name, offer_name, reward, leadstar_description_html, leadstar_benefits_html, ai_generated_at")
    .eq("is_active", true)
    .not("leadstar_description_html", "is", null)
    .is("ai_generated_at", null)
    .limit(1);

  if (error) {
    console.error("Błąd pobierania ofert:", error.message);
    process.exit(1);
  }

  if (!offers || offers.length === 0) {
    const { error: e2 } = await supabase.from("offers").select("ai_generated_at").limit(1);
    console.log("Brak ofert do generowania. Kolumna ai_generated_at:", e2 ? "BŁĄD: " + e2.message : "istnieje ✓");
    process.exit(0);
  }

  const offer = offers[0];
  console.log(`Oferta: ${offer.bank_name} — ${offer.offer_name}`);
  console.log(`Premia: ${offer.reward} zł`);
  console.log(`Opis z feedu: ${offer.leadstar_description_html?.length ?? 0} znaków`);
  console.log(`Warunki z feedu: ${offer.leadstar_benefits_html?.length ?? 0} znaków`);
  console.log("\nGeneruję przez Gemini AI...\n");

  const start = Date.now();
  const content = await generateOfferContent(
    offer.bank_name,
    offer.offer_name,
    offer.reward || 0,
    offer.leadstar_description_html || "",
    offer.leadstar_benefits_html || ""
  );
  const duration = ((Date.now() - start) / 1000).toFixed(1);

  if (!content) {
    console.error("❌ Gemini nie zwrócił poprawnej treści.");
    process.exit(1);
  }

  console.log(`✓ Wygenerowano w ${duration}s\n`);
  console.log("=== SHORT DESCRIPTION ===");
  console.log(content.short_description);
  console.log("\n=== FULL DESCRIPTION ===");
  console.log(content.full_description);
  console.log("\n=== PROS ===");
  content.pros.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
  console.log("\n=== CONS ===");
  content.cons.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  console.log("\n=== FAQ ===");
  content.faq.forEach((f, i) => console.log(`  Q${i + 1}: ${f.question}\n  A:  ${f.answer}\n`));
  console.log("\nZapisuję do bazy...");
  const { error: saveError } = await supabase
    .from("offers")
    .update({
      short_description: content.short_description,
      full_description: content.full_description,
      pros: content.pros,
      cons: content.cons,
      faq: content.faq,
      ai_generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", offer.id);

  if (saveError) {
    console.error("❌ Błąd zapisu:", saveError.message);
  } else {
    console.log(`✓ Zapisano dla: ${offer.bank_name} (${offer.id})`);
  }
}

main().catch(console.error);
