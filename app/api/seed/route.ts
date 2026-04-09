import { seedScenarios } from "@/lib/seedScenarios";

export async function POST(request: Request) {
  try {
    console.log("[API /seed] Starting seed request...");
    await seedScenarios();
    console.log("[API /seed] ✓ Scenarios seeded successfully!");
    return Response.json({
      success: true,
      message: "Scenarios seeded successfully!",
    });
  } catch (error) {
    console.error("[API /seed] ✗ Seed failed with error:", error);
    
    // Better error extraction
    let message = "Unknown error";
    let details = String(error);
    
    if (error instanceof Error) {
      message = error.message;
      details = error.stack || error.toString();
    } else if (error && typeof error === 'object') {
      message = (error as any).message || JSON.stringify(error);
      details = JSON.stringify(error, null, 2);
    } else if (typeof error === 'string') {
      message = error;
    }
    
    console.error("[API /seed] Message:", message);
    console.error("[API /seed] Details:", details);
    
    return Response.json(
      {
        success: false,
        error: message,
        details: details,
      },
      { status: 500 }
    );
  }
}

