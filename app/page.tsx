"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle, Building2, User, Briefcase, MapPin, TrendingUp, Phone, Users, FileText, DollarSign } from 'lucide-react'

interface CustomerData {
  Edad: number
  Genero: number
  EstadoCivil: number
  CantidadHijos: number
  CantidadTelefonos: number
  Trabaja: boolean
  Ingreso: number
  Antiguedad_Meses: number
  Trabajo_Fisico: boolean
  Provincia: number
  Patrono: number
  Hacienda_Inscrito: boolean
  nivel_ingreso: number
  riesgo_despido: number
  movilidad_social: number
}

interface PredictionResponse {
  mal_pagador: boolean
  probabilidad: number
}

const ColorSlider = ({
  value,
  onValueChange,
  labels,
  title,
  icon: Icon,
  isPositive = false, // New prop to indicate if higher values are better
}: {
  value: number[]
  onValueChange: (value: number[]) => void
  labels: string[]
  title: string
  icon: React.ElementType
  isPositive?: boolean // Add this prop
}) => {
  const getSliderColor = (val: number) => {
    if (isPositive) {
      // For positive metrics (income level, social mobility) - higher is better
      const colors = [
        "bg-red-600", // 1 - Muy Bajo/Baja (bad)
        "bg-red-400", // 2 - Bajo/Baja (bad)
        "bg-orange-400", // 3 - Medio/Media (neutral)
        "bg-yellow-400", // 4 - Alto/Alta (good)
        "bg-green-500", // 5 - Muy Alto/Muy Alta (very good)
      ]
      return colors[val - 1] || colors[0]
    } else {
      // For risk metrics - lower is better
      const colors = [
        "bg-green-500", // 1 - Muy Bajo (good)
        "bg-yellow-400", // 2 - Bajo (ok)
        "bg-orange-400", // 3 - Medio (neutral)
        "bg-red-400", // 4 - Alto (bad)
        "bg-red-600", // 5 - Muy Alto (very bad)
      ]
      return colors[val - 1] || colors[0]
    }
  }

  const getTextColor = (val: number) => {
    if (isPositive) {
      // For positive metrics
      const colors = [
        "text-red-700", // 1
        "text-red-600", // 2
        "text-orange-700", // 3
        "text-yellow-700", // 4
        "text-green-700", // 5
      ]
      return colors[val - 1] || colors[0]
    } else {
      // For risk metrics
      const colors = [
        "text-green-700", // 1
        "text-yellow-700", // 2
        "text-orange-700", // 3
        "text-red-600", // 4
        "text-red-700", // 5
      ]
      return colors[val - 1] || colors[0]
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <Label className="text-sm font-medium">{title}</Label>
      </div>
      <div className="px-3">
        <Slider value={value} onValueChange={onValueChange} max={5} min={1} step={1} className="w-full" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
      <div className={`text-center p-2 rounded-md ${getSliderColor(value[0])} bg-opacity-20`}>
        <span className={`font-semibold ${getTextColor(value[0])}`}>{labels[value[0] - 1]}</span>
      </div>
    </div>
  )
}

export default function PredictorMorosidadCostaRica() {
  const [formData, setFormData] = useState<CustomerData>({
    Edad: 0,
    Genero: 1,
    EstadoCivil: 1,
    CantidadHijos: 0,
    CantidadTelefonos: 1,
    Trabaja: false,
    Ingreso: 0,
    Antiguedad_Meses: 0,
    Trabajo_Fisico: false,
    Provincia: 1,
    Patrono: 1,
    Hacienda_Inscrito: false,
    nivel_ingreso: 3,
    riesgo_despido: 3,
    movilidad_social: 3,
  })

  const [selectedProvince, setSelectedProvince] = useState<string>("1")
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState<string>("")

  const provinces = [
    { value: "1", label: "San José" },
    { value: "2", label: "Alajuela" },
    { value: "3", label: "Cartago" },
    { value: "4", label: "Heredia" },
    { value: "5", label: "Guanacaste" },
    { value: "6", label: "Puntarenas" },
    { value: "7", label: "Limón" },
  ]

  const incomeLabels = ["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]
  const riskLabels = ["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]
  const mobilityLabels = ["Muy Baja", "Baja", "Media", "Alta", "Muy Alta"]

  // Update provincia when selectedProvince changes
  useEffect(() => {
    if (selectedProvince) {
      setFormData((prev) => ({ ...prev, Provincia: parseInt(selectedProvince) }))
    }
  }, [selectedProvince])

  const handleInputChange = (field: keyof CustomerData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? (field === 'Trabaja' || field === 'Trabajo_Fisico' || field === 'Hacienda_Inscrito' ? value === 'true' : Number.parseInt(value) || 0) : value,
    }))
  }

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province)
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "")
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    const numericValue = Number.parseInt(formatted.replace(/,/g, "")) || 0
    setFormData((prev) => ({ ...prev, Ingreso: numericValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setPrediction(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al obtener la predicción")
      }

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError("Error al procesar la predicción. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-16 w-16 text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Evaluación Crediticia</h1>
              <p className="text-lg text-gray-600">Predicción de Riesgo de Morosidad - Costa Rica</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription className="text-blue-100">Datos básicos del cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="flex items-center text-sm font-medium">
                      <User className="mr-1 h-3 w-3" />
                      Edad
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      value={formData.Edad === 0 ? "" : formData.Edad}
                      onChange={(e) => handleInputChange("Edad", e.target.value)}
                      className="mt-1"
                      placeholder="Ej: 35"
                      required
                    />
                  </div>
                  <div>
                    <Label className="flex items-center text-sm font-medium">
                      <Users className="mr-1 h-3 w-3" />
                      Género
                    </Label>
                    <Select
                      value={formData.Genero.toString()}
                      onValueChange={(value) => handleInputChange("Genero", Number.parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Masculino</SelectItem>
                        <SelectItem value="2">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center text-sm font-medium">
                    <Users className="mr-1 h-3 w-3" />
                    Estado Civil
                  </Label>
                                      <Select
                      value={formData.EstadoCivil.toString()}
                      onValueChange={(value) => handleInputChange("EstadoCivil", Number.parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Soltero(a)</SelectItem>
                        <SelectItem value="2">Casado(a)</SelectItem>
                        <SelectItem value="3">Divorciado(a)</SelectItem>
                        <SelectItem value="4">Viudo(a)</SelectItem>
                        <SelectItem value="5">Reconciliación Judicial</SelectItem>
                        <SelectItem value="6">Separación Judicial</SelectItem>
                        <SelectItem value="7">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div>
                  <Label htmlFor="children" className="flex items-center text-sm font-medium">
                    <Users className="mr-1 h-3 w-3" />
                    Cantidad de Hijos
                  </Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.CantidadHijos}
                    onChange={(e) => handleInputChange("CantidadHijos", e.target.value)}
                    className="mt-1"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="phones" className="flex items-center text-sm font-medium">
                    <Phone className="mr-1 h-3 w-3" />
                    Cantidad de Teléfonos
                  </Label>
                  <Input
                    id="phones"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.CantidadTelefonos}
                    onChange={(e) => handleInputChange("CantidadTelefonos", e.target.value)}
                    className="mt-1"
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Información Laboral
                </CardTitle>
                <CardDescription className="text-green-100">Detalles de empleo e ingresos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <Label className="flex items-center text-sm font-medium">
                    <Briefcase className="mr-1 h-3 w-3" />
                    ¿Trabaja Actualmente?
                  </Label>
                  <Select
                    value={formData.Trabaja.toString()}
                    onValueChange={(value) => handleInputChange("Trabaja", value === 'true')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Sí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="income" className="flex items-center text-sm font-medium">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Ingresos Mensuales
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      ₡
                    </span>
                    <Input
                      id="income"
                      type="text"
                      value={formData.Ingreso === 0 ? "0" : formatCurrency(formData.Ingreso.toString())}
                      onChange={handleIncomeChange}
                      className="pl-8"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tenure" className="flex items-center text-sm font-medium">
                    <FileText className="mr-1 h-3 w-3" />
                    Antigüedad Laboral (Meses)
                  </Label>
                  <Input
                    id="tenure"
                    type="number"
                    min="0"
                    value={formData.Antiguedad_Meses}
                    onChange={(e) => handleInputChange("Antiguedad_Meses", e.target.value)}
                    className="mt-1"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label className="flex items-center text-sm font-medium">
                    <Briefcase className="mr-1 h-3 w-3" />
                    ¿Trabajo Físico?
                  </Label>
                  <Select
                    value={formData.Trabajo_Fisico.toString()}
                    onValueChange={(value) => handleInputChange("Trabajo_Fisico", value === 'true')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Sí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center text-sm font-medium">
                    <Building2 className="mr-1 h-3 w-3" />
                    Tipo Patrono
                  </Label>
                  <Select
                    value={formData.Patrono.toString()}
                    onValueChange={(value) => handleInputChange("Patrono", Number.parseInt(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">ATV</SelectItem>
                      <SelectItem value="2">Gobierno</SelectItem>
                      <SelectItem value="3">Independiente</SelectItem>
                      <SelectItem value="4">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Información de Ubicación
                </CardTitle>
                <CardDescription className="text-purple-100">Datos geográficos y fiscales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <Label htmlFor="province" className="flex items-center text-sm font-medium">
                    <MapPin className="mr-1 h-3 w-3" />
                    Provincia
                  </Label>
                  <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>



                <div>
                  <Label className="flex items-center text-sm font-medium">
                    <FileText className="mr-1 h-3 w-3" />
                    ¿Inscrito en Hacienda?
                  </Label>
                  <Select
                    value={formData.Hacienda_Inscrito.toString()}
                    onValueChange={(value) => handleInputChange("Hacienda_Inscrito", value === 'true')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Sí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment Sliders */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Evaluación de Factores de Riesgo
              </CardTitle>
              <CardDescription className="text-orange-100">Deslice para ajustar los niveles de riesgo</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ColorSlider
                  value={[formData.nivel_ingreso]}
                  onValueChange={(value) => handleInputChange("nivel_ingreso", value[0])}
                  labels={incomeLabels}
                  title="Nivel de Ingresos"
                  icon={DollarSign}
                  isPositive={true} // Higher income is better (green)
                />

                <ColorSlider
                  value={[formData.riesgo_despido]}
                  onValueChange={(value) => handleInputChange("riesgo_despido", value[0])}
                  labels={riskLabels}
                  title="Riesgo de Despido"
                  icon={AlertTriangle}
                  isPositive={false} // Higher risk is worse (red)
                />

                <ColorSlider
                  value={[formData.movilidad_social]}
                  onValueChange={(value) => handleInputChange("movilidad_social", value[0])}
                  labels={mobilityLabels}
                  title="Movilidad Social"
                  icon={TrendingUp}
                  isPositive={true} // Higher mobility is better (green)
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full max-w-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analizando Riesgo...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Evaluar Riesgo de Morosidad
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Results */}
        {error && (
          <Alert variant="destructive" className="mt-6 shadow-lg">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {prediction !== null && (() => {
          const probPct = prediction.probabilidad * 100
          const isLow = probPct < 20
          const isMedium = probPct >= 20 && probPct <= 50
          const isHigh = probPct > 50

          const headerBg = isHigh
            ? "bg-gradient-to-r from-red-500 to-red-600"
            : isMedium
            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
            : "bg-gradient-to-r from-green-500 to-green-600"

          const panelBg = isHigh
            ? "bg-red-50 border-red-200"
            : isMedium
            ? "bg-yellow-50 border-yellow-200"
            : "bg-green-50 border-green-200"

          const badgeBg = isHigh
            ? "bg-red-100"
            : isMedium
            ? "bg-yellow-100"
            : "bg-green-100"

          const textColor = isHigh
            ? "text-red-800"
            : isMedium
            ? "text-yellow-800"
            : "text-green-800"

          const subTextColor = isHigh
            ? "text-red-700"
            : isMedium
            ? "text-yellow-700"
            : "text-green-700"

          const title = isHigh
            ? "Resultado: ALTA probabilidad de morosidad"
            : isMedium
            ? "Resultado: MEDIA probabilidad de morosidad"
            : "Resultado: BAJA probabilidad de morosidad"

          return (
            <Card className="mt-6 shadow-xl border-0">
              <CardHeader className={`${headerBg} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center text-xl">
                  {isHigh ? (
                    <AlertTriangle className="h-8 w-8 mr-3" />
                  ) : (
                    <CheckCircle className="h-8 w-8 mr-3" />
                  )}
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={`p-6 rounded-lg border-2 ${panelBg}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${badgeBg}`}>
                      {isHigh ? (
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      ) : isMedium ? (
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${textColor}`}>
                        {title}
                      </h3>
                      <div className="mb-4">
                        <p className={`text-base mb-2 ${subTextColor}`}>
                          Probabilidad de morosidad: {probPct.toFixed(2)}%
                        </p>
                        <div className={`p-3 rounded-md ${badgeBg}`}>
                          <span className={`text-sm font-medium ${textColor}`}>
                            Interpretación basada en el umbral seleccionado.
                          </span>
                        </div>
                      </div>
                      <div className={`p-4 rounded-md ${badgeBg}`}>
                        <h4 className={`font-semibold mb-2 ${textColor}`}>Recomendaciones:</h4>
                        <ul className={`text-sm space-y-1 ${subTextColor}`}>
                          {isHigh ? (
                            <>
                              <li>• Solicitar garantías adicionales o avales</li>
                              <li>• Considerar un monto de crédito reducido</li>
                              <li>• Implementar seguimiento más frecuente</li>
                              <li>• Evaluar condiciones especiales de pago</li>
                            </>
                          ) : isMedium ? (
                            <>
                              <li>• Evaluación adicional recomendada</li>
                              <li>• Considerar condiciones de pago moderadas</li>
                              <li>• Seguimiento periódico</li>
                            </>
                          ) : (
                            <>
                              <li>• Cliente apto para condiciones estándar</li>
                              <li>• Considerar para productos preferenciales</li>
                              <li>• Seguimiento rutinario recomendado</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })()}
      </div>
    </div>
  )
}
