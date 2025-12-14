from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="Proposal App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class CostParams(BaseModel):
    labor_hourly_rate: float = 45.0  # USD/Hour
    overhead_percentage: float = 25.0 # %
    profit_margin: float = 30.0 # %
    currency_rate: float = 34.5 # USD to TRY (Example)

class ProductSpecs(BaseModel):
    sections: int
    dimensions_raw: str
    diameter_mm: int
    payload_capacity_kg: int
    voltage: str
    features: List[str]

class BaseCostFactors(BaseModel):
    material_cost: float
    labor_hours: float
    complexity_score: float

class Product(BaseModel):
    id: str
    name: str
    specs: ProductSpecs
    base_cost_factors: BaseCostFactors

class CostCalculation(BaseModel):
    product_id: str
    raw_material_cost: float
    labor_cost: float
    overhead_cost: float
    total_cost: float
    suggested_price: float
    currency: str = "USD"
    price_try: float

# --- Data Loading ---
def load_products():
    try:
        with open("products.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# --- Endpoints ---

@app.get("/products", response_model=List[Product])
def get_products():
    return load_products()

@app.post("/calculate-cost", response_model=CostCalculation)
def calculate_cost(product_id: str, params: CostParams):
    products = load_products()
    product = next((p for p in products if p["id"] == product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    factors = product["base_cost_factors"]
    
    # Calculation Logic
    labor_cost = factors["labor_hours"] * params.labor_hourly_rate
    base_cost = factors["material_cost"] + labor_cost
    overhead = base_cost * (params.overhead_percentage / 100)
    total_cost = base_cost + overhead
    price = total_cost * (1 + (params.profit_margin / 100))
    
    return {
        "product_id": product_id,
        "raw_material_cost": factors["material_cost"],
        "labor_cost": labor_cost,
        "overhead_cost": overhead,
        "total_cost": total_cost,
        "suggested_price": price,
        "currency": "USD",
        "price_try": price * params.currency_rate
    }

@app.get("/")
def read_root():
    return {"message": "Proposal App API is running", "status": "active"}
