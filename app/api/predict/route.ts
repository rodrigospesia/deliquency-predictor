import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Call the Python API running on localhost:5000
    const pythonApiResponse = await fetch("http://localhost:5000/predict", {
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


