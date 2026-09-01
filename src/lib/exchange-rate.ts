export async function getUsdToInrRate(): Promise<number> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 } // cache for 1 hour
    });
    
    if (!response.ok) {
      console.warn("Failed to fetch exchange rate, using fallback rate");
      return 85; // Fallback rate
    }
    
    const data = await response.json();
    if (data && data.rates && data.rates.INR) {
      return data.rates.INR;
    }
    
    return 85; // Fallback if data is malformed
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return 85; // Fallback rate in case of network error
  }
}
