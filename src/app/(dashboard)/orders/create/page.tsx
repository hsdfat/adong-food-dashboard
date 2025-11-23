// app/(dashboard)/orders/create/page.tsx
'use client'

import React from 'react'
import { Card, CardBody, CardHeader, Button } from 'react-bootstrap'
import OrderForm from '@/components/Page/Order/OrderForm'
import useDictionary from '@/locales/dictionary-hook'

// Sample best supplier data provided by the user
const sampleBestSuppliersData = {
  "ingredients": [
    {
      "ingredientId": "ING001",
      "ingredientName": "Thịt heo ba chỉ",
      "totalQuantity": 10,
      "unit": "kg",
      "bestSupplier": {
        "productId": 2,
        "productName": "",
        "supplierId": "SUP005",
        "supplierName": "Nhà phân phối Thịt Sạch An Toàn",
        "unitPrice": 145000,
        "unit": "kg",
        "specification": "",
        "isFavorite": false,
        "isLowestPrice": true,
        "totalCost": 1450000
      }
    },
    {
      "ingredientId": "ING006",
      "ingredientName": "Tôm sú",
      "totalQuantity": 6,
      "unit": "kg",
      "bestSupplier": {
        "productId": 13,
        "productName": "",
        "supplierId": "SUP002",
        "supplierName": "Nhà cung cấp Hải sản Tươi Sống",
        "unitPrice": 450000,
        "unit": "kg",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 2700000
      }
    },
    {
      "ingredientId": "ING012",
      "ingredientName": "Hành tây",
      "totalQuantity": 2.5,
      "unit": "kg",
      "bestSupplier": {
        "productId": 26,
        "productName": "",
        "supplierId": "SUP003",
        "supplierName": "Cửa hàng Rau Củ Đà Lạt",
        "unitPrice": 26000,
        "unit": "kg",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 65000
      }
    },
    {
      "ingredientId": "ING014",
      "ingredientName": "Rau muống",
      "totalQuantity": 12,
      "unit": "kg",
      "bestSupplier": {
        "productId": 30,
        "productName": "",
        "supplierId": "SUP003",
        "supplierName": "Cửa hàng Rau Củ Đà Lạt",
        "unitPrice": 17000,
        "unit": "kg",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 204000
      }
    },
    {
      "ingredientId": "ING016",
      "ingredientName": "Ớt",
      "totalQuantity": 2,
      "unit": "kg",
      "bestSupplier": {
        "productId": 34,
        "productName": "",
        "supplierId": "SUP004",
        "supplierName": "Công ty Gia vị Việt Nam",
        "unitPrice": 33000,
        "unit": "kg",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 66000
      }
    },
    {
      "ingredientId": "ING017",
      "ingredientName": "Nước mắm",
      "totalQuantity": 4.6,
      "unit": "lít",
      "bestSupplier": {
        "productId": 36,
        "productName": "",
        "supplierId": "SUP004",
        "supplierName": "Công ty Gia vị Việt Nam",
        "unitPrice": 43000,
        "unit": "lít",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 197799.99999999997
      }
    },
    {
      "ingredientId": "ING018",
      "ingredientName": "Dầu ăn",
      "totalQuantity": 1.35,
      "unit": "lít",
      "bestSupplier": {
        "productId": 38,
        "productName": "",
        "supplierId": "SUP004",
        "supplierName": "Công ty Gia vị Việt Nam",
        "unitPrice": 33000,
        "unit": "lít",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 44550
      }
    },
    {
      "ingredientId": "ING019",
      "ingredientName": "Hạt tiêu",
      "totalQuantity": 0.09,
      "unit": "kg",
      "bestSupplier": {
        "productId": 40,
        "productName": "",
        "supplierId": "SUP004",
        "supplierName": "Công ty Gia vị Việt Nam",
        "unitPrice": 175000,
        "unit": "kg",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 15750
      }
    },
    {
      "ingredientId": "ING020",
      "ingredientName": "Muối",
      "totalQuantity": 0.25,
      "unit": "kg",
      "bestSupplier": {
        "productId": 42,
        "productName": "",
        "supplierId": "SUP004",
        "supplierName": "Công ty Gia vị Việt Nam",
        "unitPrice": 7500,
        "unit": "kg",
        "specification": "",
        "isFavorite": true,
        "isLowestPrice": true,
        "totalCost": 1875
      }
    },
    {
      "ingredientId": "ING021",
      "ingredientName": "Gạo tẻ",
      "totalQuantity": 30,
      "unit": "kg",
      "bestSupplier": {
        "productId": 44,
        "productName": "",
        "supplierId": "SUP006",
        "supplierName": "Cửa hàng Gạo Đồng Tháp",
        "unitPrice": 21000,
        "unit": "kg",
        "specification": "",
        "isFavorite": false,
        "isLowestPrice": true,
        "totalCost": 630000
      }
    },
    {
      "ingredientId": "ING024",
      "ingredientName": "Trứng gà",
      "totalQuantity": 100,
      "unit": "quả",
      "bestSupplier": {
        "productId": 50,
        "productName": "",
        "supplierId": "SUP005",
        "supplierName": "Nhà phân phối Thịt Sạch An Toàn",
        "unitPrice": 3300,
        "unit": "quả",
        "specification": "",
        "isFavorite": false,
        "isLowestPrice": true,
        "totalCost": 330000
      }
    }
  ],
  "kitchenId": "KIT001",
  "orderId": "ORD001"
}

export default function CreateOrderPage() {
  const dict = useDictionary()
  const [showPreFilled, setShowPreFilled] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4>{dict.sidebar?.items?.order || 'Orders'}</h4>
            <div className="text-muted">
              {dict.orders?.title || 'Manage orders'}
            </div>
          </div>
          <Button
            variant={showPreFilled ? "secondary" : "primary"}
            onClick={() => setShowPreFilled(!showPreFilled)}
          >
            {showPreFilled ? "Clear Pre-filled Data" : "Load Sample Best Suppliers Data"}
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <OrderForm preFillData={showPreFilled ? sampleBestSuppliersData : undefined} />
      </CardBody>
    </Card>
  )
}
