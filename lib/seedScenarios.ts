import { supabase } from "@/lib/supabase";

export type OHLCV = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type ScenarioInsert = {
  name: string;
  description: string;
  difficulty: string;
  ohlcv_data: OHLCV[];
};

// Helper function to parse comma-separated numbers
function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/,/g, ""));
}

// Helper function to parse volume (e.g., "653.54M" or "1.07B")
function parseVolume(volStr: string): number {
  if (!volStr) return 1000000;
  const multipliers: { [key: string]: number } = {
    M: 1_000_000,
    B: 1_000_000_000,
    K: 1_000,
  };
  
  const match = volStr.toUpperCase().match(/^([\d.]+)([MBK])$/);
  if (!match) return 1000000;
  
  const value = parseFloat(match[1]);
  const suffix = match[2];
  return Math.round(value * (multipliers[suffix] || 1));
}

// Helper function to parse date (DD-MM-YYYY to YYYY-MM-DD)
function parseDateDDMMYYYY(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

export async function seedScenarios() {
  try {
    console.log("[seedScenarios] Starting...");
    
    // Fetch data from existing raw tables
    console.log("[seedScenarios] Fetching raw data from tables...");
    const preCovidRes = await supabase.from("precovidrally").select("*").order("id", { ascending: true });
    const postCovidRes = await supabase.from("postcovidrally").select("*").order("id", { ascending: true });
    const choppyRes = await supabase.from("market_candles_raw").select("*").order("id", { ascending: true });

    console.log(`[seedScenarios] precovidrally rows: ${preCovidRes.data?.length || 0}`);
    console.log(`[seedScenarios] postcovidrally rows: ${postCovidRes.data?.length || 0}`);
    console.log(`[seedScenarios] market_candles_raw rows: ${choppyRes.data?.length || 0}`);

    if (preCovidRes.error) throw new Error(`Failed to fetch precovidrally: ${preCovidRes.error.message}`);
    if (postCovidRes.error) throw new Error(`Failed to fetch postcovidrally: ${postCovidRes.error.message}`);
    if (choppyRes.error) throw new Error(`Failed to fetch market_candles_raw: ${choppyRes.error.message}`);

    // Convert raw data to OHLCV format
    const convertToOHLCV = (rawData: any[]): OHLCV[] => {
      if (!rawData || rawData.length === 0) return [];
      
      return rawData.map((row: any) => {
        try {
          return {
            date: parseDateDDMMYYYY(row.Date || row.date),
            open: parsePrice(row.Open || row.open || "0"),
            high: parsePrice(row.High || row.high || "0"),
            low: parsePrice(row.Low || row.low || "0"),
            close: parsePrice(row.Price || row.price || row.Close || row.close || "0"),
            volume: parseVolume(row["Vol."] || row.vol || row.volume || "0"),
          };
        } catch (e) {
          console.warn("[seedScenarios] Error parsing row:", row, e);
          return null;
        }
      }).filter((ohlcv): ohlcv is OHLCV => ohlcv !== null && ohlcv.date.length > 0);
    };

    console.log("[seedScenarios] Converting data to OHLCV format...");
    const preCovidOHLCV = convertToOHLCV(preCovidRes.data || []);
    const postCovidOHLCV = convertToOHLCV(postCovidRes.data || []);
    const choppyOHLCV = convertToOHLCV(choppyRes.data || []);

    console.log(`[seedScenarios] Converted preCovidOHLCV: ${preCovidOHLCV.length} candles`);
    console.log(`[seedScenarios] Converted postCovidOHLCV: ${postCovidOHLCV.length} candles`);
    console.log(`[seedScenarios] Converted choppyOHLCV: ${choppyOHLCV.length} candles`);

    const scenarios: ScenarioInsert[] = [
      {
        name: "Pre-COVID Rally",
        description:
          "March 2020: Sharp market crash before COVID lockdowns. Investors panicked as concerns spread globally.",
        difficulty: "Hard",
        ohlcv_data: preCovidOHLCV,
      },
      {
        name: "Post-COVID Recovery",
        description:
          "December 2020: Market recovery phase post-pandemic. Vaccine announcements and economic stimulus drove optimism.",
        difficulty: "Medium",
        ohlcv_data: postCovidOHLCV,
      },
      {
        name: "Choppy Sideways Market",
        description:
          "June 2021: Range-bound trading with no clear direction. Test your discipline in uncertain markets.",
        difficulty: "Easy",
        ohlcv_data: choppyOHLCV,
      },
    ];

    // Insert if missing by name (idempotent)
    console.log("[seedScenarios] Inserting scenarios into database...");
    for (const s of scenarios) {
      console.log(`[seedScenarios] Checking if "${s.name}" exists...`);
      const existing = await supabase
        .from("scenarios")
        .select("id")
        .eq("name", s.name)
        .maybeSingle();

      if (existing.error && existing.error.code !== "PGRST116") {
        console.error(`[seedScenarios] Error checking existing scenario:`, existing.error);
        throw existing.error;
      }

      if (existing.data?.id) {
        console.log(`[seedScenarios] ✓ Scenario "${s.name}" already exists (${s.ohlcv_data.length} candles).`);
        continue;
      }

      console.log(`[seedScenarios] Inserting "${s.name}" with ${s.ohlcv_data.length} candles...`);
      const insert = await supabase.from("scenarios").insert({
        name: s.name,
        description: s.description,
        difficulty: s.difficulty,
        ohlcv_data: s.ohlcv_data,
      });

      if (insert.error) {
        console.error(`[seedScenarios] ✗ Failed to insert "${s.name}":`, insert.error);
        throw insert.error;
      }

      console.log(`[seedScenarios] ✓ Inserted scenario "${s.name}" (${s.ohlcv_data.length} candles).`);
    }

    console.log("[seedScenarios] ✓ Scenarios seeded successfully!");
  } catch (error) {
    console.error("[seedScenarios] ✗ Seed failed:", error);
    throw error;
  }
}

