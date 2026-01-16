"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, DollarSign, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Service, PriceType } from "@/lib/types"

interface ServicesManagerProps {
  services: Partial<Service>[]
  onServicesChange: (services: Partial<Service>[]) => void
}

const currencies = [
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
]

export function ServicesManager({
  services,
  onServicesChange,
}: ServicesManagerProps) {
  const addService = () => {
    onServicesChange([
      ...services,
      {
        title: "",
        description: "",
        price_type: "quote",
        price_amount: null,
        currency: "EUR",
      },
    ])
  }

  const updateService = (index: number, updates: Partial<Service>) => {
    const updated = [...services]
    updated[index] = { ...updated[index], ...updates }
    onServicesChange(updated)
  }

  const removeService = (index: number) => {
    onServicesChange(services.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-medium">No services added</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Add services to showcase what you offer to potential clients
          </p>
          <Button onClick={addService}>
            <Plus className="h-4 w-4" />
            Add Your First Service
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Service {index + 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Service Title *</Label>
                    <Input
                      placeholder="e.g., Website Development"
                      value={service.title || ""}
                      onChange={(e) =>
                        updateService(index, { title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe what this service includes..."
                      rows={3}
                      value={service.description || ""}
                      onChange={(e) =>
                        updateService(index, { description: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Pricing Type</Label>
                      <Select
                        value={service.price_type || "quote"}
                        onValueChange={(value: PriceType) =>
                          updateService(index, { price_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Fixed Price
                            </div>
                          </SelectItem>
                          <SelectItem value="quote">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Request Quote
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {service.price_type === "fixed" && (
                      <>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select
                            value={service.currency || "EUR"}
                            onValueChange={(value) =>
                              updateService(index, { currency: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Price</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            min={0}
                            step={0.01}
                            value={service.price_amount || ""}
                            onChange={(e) =>
                              updateService(index, {
                                price_amount: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" onClick={addService} className="w-full">
            <Plus className="h-4 w-4" />
            Add Another Service
          </Button>
        </>
      )}

      {services.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          You can always add or edit services later from your dashboard
        </p>
      )}
    </div>
  )
}
