import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Simulate API call to ML model
    // In a real implementation, this would call your actual ML prediction service
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

    // Mock prediction logic based on some risk factors
    // This is just for demonstration - replace with actual ML model endpoint
    const riskScore = calculateRiskScore(data)
    const prediction = riskScore > 0.5

    return NextResponse.json({
      prediction,
      riskScore,
      message: prediction ? "Alto riesgo de morosidad detectado" : "Bajo riesgo de morosidad",
      factors: {
        age: data.Edad,
        employment: data.Trabaja,
        income: data.Ingreso,
        gam: data.Vive_GAM,
        employerType: data.TipoPatrono,
      },
    })
  } catch (error) {
    console.error("Error de predicción:", error)
    return NextResponse.json({ error: "Error al procesar la predicción" }, { status: 500 })
  }
}

// Enhanced risk calculation for Costa Rican market
function calculateRiskScore(data: any): number {
  let score = 0

  // Age factor (Costa Rican market specific)
  if (data.Edad < 23 || data.Edad > 67) score += 0.15

  // Employment factor (critical in Costa Rica)
  if (data.Trabaja === 0) score += 0.35

  // Income factor (adjusted for Costa Rican salaries)
  if (data.Ingreso < 400000)
    score += 0.25 // Below minimum wage
  else if (data.Ingreso < 600000) score += 0.15

  // Tenure factor
  if (data.Antiguedad_Meses < 6) score += 0.2
  else if (data.Antiguedad_Meses < 12) score += 0.1

  // Children factor (family burden)
  if (data.CantidadHijos > 4) score += 0.15
  else if (data.CantidadHijos > 2) score += 0.08

  // Civil status factor (financial stability)
  if (data.EstadoCivil === 2)
    score += 0.05 // Divorced - potential financial strain
  else if (data.EstadoCivil === 3)
    score += 0.03 // Widow - potential income reduction
  else if (data.EstadoCivil === 1) score -= 0.05 // Married - typically more stable

  // Employer type factor (job stability in Costa Rica)
  if (data.TipoPatrono === 0)
    score += 0.12 // Independent - higher income variability
  else if (data.TipoPatrono === 3)
    score -= 0.08 // Government - most stable employment
  else if (data.TipoPatrono === 2)
    score -= 0.05 // ATV - relatively stable
  // Private remains neutral (value 1)

  // GAM area factor (higher cost of living)
  if (data.Vive_GAM === 1 && data.Ingreso < 800000) score += 0.1

  // Risk factors (weighted for Costa Rican context)
  if (data.riesgo_despido > 3) score += 0.25
  if (data.nivel_ingreso < 3) score += 0.2
  if (data.movilidad_social < 3) score += 0.12

  // Tax registration (important for formal economy)
  if (data.Hacienda_Inscrito === 0) score += 0.15

  // Physical work factor (job stability)
  if (data.trabajo_fisico === 1) score += 0.08

  return Math.min(score, 1) // Cap at 1.0
}
