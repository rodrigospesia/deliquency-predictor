import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Determine API endpoint based on environment
    const isLocal = process.env.NODE_ENV === 'development' || 
                   process.env.VERCEL_ENV === 'development' || 
                   !process.env.VERCEL_URL
    
    const apiUrl = isLocal 
      ? "http://localhost:8080/predict"
      : "https://predictor-api-y2tcpa.fly.dev/predict"

    console.log(`Using API endpoint: ${apiUrl}`)

    // Call the Python API
    const pythonApiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!pythonApiResponse.ok) {
      throw new Error(`Python API responded with status: ${pythonApiResponse.status}`)
    }

    const prediction = await pythonApiResponse.json()

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error calling Python API:", error)
    
    return NextResponse.json(
      { 
        error: "Error al obtener predicción de morosidad." 
      }, 
      { status: 503 }
    )
  }
}


