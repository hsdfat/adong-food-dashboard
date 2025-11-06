'use client'

import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Card,
  CardBody,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
  Table,
  Row,
  Col,
  InputGroup,
  Badge,
  Modal,
  FormCheck,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faTrash,
  faEdit,
  faSave,
  faTimes,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'
import { kitchenApi, dishApi, ingredientApi, recipeStandardApi, orderApi } from '@/services'
import { Kitchen, RecipeStandard } from '@/models'
import { Dish as DishModel, Ingredient as IngredientModel } from '@/models'
import { CreateOrderInput } from '@/models/order'

// Types - Local interfaces for order form data
interface OrderIngredient {
  nguyenLieuId: string
  tenNguyenLieu: string
  donViTinh: string
  dinhMuc: number
}

interface OrderDish {
  dishId: string
  dishName: string
  ingredients: OrderIngredient[]
}

interface OrderDishItem {
  id: string
  monanId: string
  tenMonAn: string
  soSuat: number
  ingredients: {
    nguyenLieuId: string
    tenNguyenLieu: string
    donViTinh: string
    dinhMuc: number
    soLuong: number
  }[]
}

interface SupplementaryFoodItem {
  id: string
  nguyenLieuId: string
  tenNguyenLieu: string
  donViTinh: string
  dinhMuc: number
  soSuat: number // Number of portions/servings
  soLuong: number
  ghiChu?: string
}

interface OrderFormProps {
  orderId?: string
  isEdit?: boolean
}

export default function OrderForm({ orderId, isEdit = false }: OrderFormProps) {
  const router = useRouter()
  const dict = useDictionary()

  // Form state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Order header
  const [phieuLenDonId, setPhieuLenDonId] = useState('')
  const [bepId, setBepId] = useState('')
  const [tenBep, setTenBep] = useState('')
  const [ngayLen, setNgayLen] = useState(new Date().toISOString().split('T')[0])
  const [ghiChu, setGhiChu] = useState('')

  // Kitchen selection modal
  const [showKitchenModal, setShowKitchenModal] = useState(false)
  const [availableKitchens, setAvailableKitchens] = useState<Kitchen[]>([])
  const [searchKitchen, setSearchKitchen] = useState('')

  // Dishes in order
  const [orderDishes, setOrderDishes] = useState<OrderDishItem[]>([])

  // Supplementary foods (NEW)
  const [supplementaryFoods, setSupplementaryFoods] = useState<
    SupplementaryFoodItem[]
  >([])

  // Modal for adding dishes
  const [showDishModal, setShowDishModal] = useState(false)
  const [availableDishes, setAvailableDishes] = useState<DishModel[]>([])
  const [dishRecipeStandards, setDishRecipeStandards] = useState<Map<string, RecipeStandard[]>>(new Map())
  const [searchDish, setSearchDish] = useState('')
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]) // Multi-select
  const [portions, setPortions] = useState(1)

  // Modal for adding ingredient to dish
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [currentDishIndex, setCurrentDishIndex] = useState<number | null>(null)
  const [availableIngredients, setAvailableIngredients] = useState<IngredientModel[]>([])
  const [searchIngredient, setSearchIngredient] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]) // Multi-select
  const [customAmount, setCustomAmount] = useState(0)

  // Modal for adding supplementary foods (NEW) - CHANGED: Default to 1
  const [showSupplementaryModal, setShowSupplementaryModal] = useState(false)
  const [
    selectedSupplementaryIngredients,
    setSelectedSupplementaryIngredients,
  ] = useState<string[]>([])
  const [supplementaryAmount, setSupplementaryAmount] = useState(1)

  // Load available dishes
  useEffect(() => {
    loadDishes()
    loadIngredients()
    loadKitchens()
    generateOrderId()
  }, [])

  // Note: Component will auto re-render when orderDishes or supplementaryFoods change
  // because getTotalIngredients() is called in the render, not in useEffect

  // Format number for display - removes trailing zeros
  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * 100) / 100
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

  // Generate order ID based on timestamp
  const generateOrderId = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    const orderId = `PLD${year}${month}${day}${hours}${minutes}${seconds}`
    setPhieuLenDonId(orderId)
  }

  const loadKitchens = async () => {
    try {
      const response = await kitchenApi.getAll('?per_page=100')
      setAvailableKitchens(response.data || [])
    } catch (err) {
      console.error('Failed to load kitchens:', err)
      setError('Không thể tải danh sách bếp')
    }
  }

  const loadDishes = async () => {
    try {
      const response = await dishApi.getAll('?per_page=100')
      const dishes = response.data || []
      setAvailableDishes(dishes)

      // Load recipe standards for all dishes
      const recipeStandardsMap = new Map<string, RecipeStandard[]>()
      for (const dish of dishes) {
        try {
          const recipeResponse = await recipeStandardApi.getByDish(dish.dishId)
          recipeStandardsMap.set(dish.dishId, recipeResponse.data || [])
        } catch (err) {
          console.error(`Failed to load recipe standards for dish ${dish.dishId}:`, err)
          recipeStandardsMap.set(dish.dishId, [])
        }
      }
      setDishRecipeStandards(recipeStandardsMap)
    } catch (err) {
      console.error('Failed to load dishes:', err)
      setError('Không thể tải danh sách món ăn')
    }
  }

  const loadIngredients = async () => {
    try {
      const response = await ingredientApi.getAll('?per_page=100')
      setAvailableIngredients(response.data || [])
    } catch (err) {
      console.error('Failed to load ingredients:', err)
      setError('Không thể tải danh sách nguyên liệu')
    }
  }

  // Add multiple dishes to order
  const handleAddDishes = () => {
    if (selectedDishes.length === 0 || portions <= 0) {
      alert('Vui lòng chọn món ăn và nhập số suất hợp lệ')
      return
    }

    const newDishes: OrderDishItem[] = selectedDishes.map((dishId) => {
      const dish = availableDishes.find((d) => d.dishId === dishId)!
      const recipeStandards = dishRecipeStandards.get(dishId) || []

      // Convert recipe standards to ingredients format
      const ingredients = recipeStandards.map((rs) => ({
        nguyenLieuId: rs.ingredientId,
        tenNguyenLieu: rs.ingredientName || '',
        donViTinh: rs.unit,
        dinhMuc: rs.standardPer1,
        soLuong: rs.standardPer1 * portions,
      }))

      return {
        id: `${Date.now()}-${Math.random()}`,
        monanId: dish.dishId,
        tenMonAn: dish.dishName,
        soSuat: portions,
        ingredients,
      }
    })

    setOrderDishes([...orderDishes, ...newDishes])
    setShowDishModal(false)
    setSelectedDishes([])
    setPortions(1)
    setSearchDish('')
  }

  // Remove dish from order
  const handleRemoveDish = (dishId: string) => {
    if (confirm('Bạn có chắc muốn xóa món này?')) {
      setOrderDishes(orderDishes.filter((d) => d.id !== dishId))
    }
  }

  // Update portions
  const handleUpdatePortions = (dishId: string, newPortions: number) => {
    if (newPortions <= 0) return

    setOrderDishes(
      orderDishes.map((dish) => {
        if (dish.id === dishId) {
          return {
            ...dish,
            soSuat: newPortions,
            ingredients: dish.ingredients.map((ing) => ({
              ...ing,
              soLuong: Math.round(ing.dinhMuc * newPortions * 100) / 100,
            })),
          }
        }
        return dish
      }),
    )
  }

  // Update định mức (NEW)
  const handleUpdateDinhMuc = (
    dishId: string,
    ingredientId: string,
    newDinhMuc: number,
  ) => {
    if (newDinhMuc < 0) return

    // Round to 2 decimals to avoid floating point issues
    const roundedDinhMuc = Math.round(newDinhMuc * 100) / 100

    setOrderDishes(
      orderDishes.map((dish) => {
        if (dish.id === dishId) {
          return {
            ...dish,
            ingredients: dish.ingredients.map((ing) =>
              ing.nguyenLieuId === ingredientId
                ? {
                  ...ing,
                  dinhMuc: roundedDinhMuc,
                  soLuong:
                    Math.round(roundedDinhMuc * dish.soSuat * 100) / 100,
                }
                : ing,
            ),
          }
        }
        return dish
      }),
    )
  }

  // Remove ingredient from dish
  const handleRemoveIngredient = (dishId: string, ingredientId: string) => {
    setOrderDishes(
      orderDishes.map((dish) => {
        if (dish.id === dishId) {
          return {
            ...dish,
            ingredients: dish.ingredients.filter(
              (ing) => ing.nguyenLieuId !== ingredientId,
            ),
          }
        }
        return dish
      }),
    )
  }

  // Add multiple custom ingredients to dish
  const handleAddCustomIngredients = () => {
    if (
      currentDishIndex === null ||
      selectedIngredients.length === 0 ||
      customAmount <= 0
    ) {
      alert('Vui lòng chọn nguyên liệu và nhập số lượng hợp lệ')
      return
    }

    const dish = orderDishes[currentDishIndex]
    const newIngredients = selectedIngredients
      .map((ingId) => {
        const ingredient = availableIngredients.find(
          (ing) => ing.ingredientId === ingId,
        )
        if (!ingredient) return null

        const exists = dish.ingredients.find(
          (ing) => ing.nguyenLieuId === ingId,
        )
        if (exists) return null

        return {
          nguyenLieuId: ingredient.ingredientId,
          tenNguyenLieu: ingredient.ingredientName,
          donViTinh: ingredient.unit,
          dinhMuc: 0,
          soLuong: customAmount,
        }
      })
      .filter((ing) => ing !== null) as any[]

    if (newIngredients.length === 0) {
      alert('Tất cả nguyên liệu đã có trong món ăn')
      return
    }

    const updatedDishes = [...orderDishes]
    updatedDishes[currentDishIndex] = {
      ...dish,
      ingredients: [...dish.ingredients, ...newIngredients],
    }

    setOrderDishes(updatedDishes)
    setShowIngredientModal(false)
    setSelectedIngredients([])
    setCustomAmount(0)
    setCurrentDishIndex(null)
    setSearchIngredient('')
  }

  // Add multiple supplementary foods (NEW) - CHANGED: Reset to default value 1, use dinhMuc from ingredient
  const handleAddSupplementaryFoods = () => {
    if (
      selectedSupplementaryIngredients.length === 0 ||
      supplementaryAmount <= 0
    ) {
      alert('Vui lòng chọn nguyên liệu và nhập số lượng hợp lệ')
      return
    }

    const newSupplementaryFoods: SupplementaryFoodItem[] =
      selectedSupplementaryIngredients
        .map((ingId) => {
          const ingredient = availableIngredients.find(
            (ing) => ing.ingredientId === ingId,
          )
          if (!ingredient) return null

          // Default dinhMuc to 0 for supplementary foods (user can edit)
          const dinhMuc = 0
          const soLuong = Math.round(dinhMuc * supplementaryAmount * 100) / 100

          return {
            id: `${Date.now()}-${Math.random()}`,
            nguyenLieuId: ingredient.ingredientId,
            tenNguyenLieu: ingredient.ingredientName,
            donViTinh: ingredient.unit,
            dinhMuc: dinhMuc,
            soSuat: supplementaryAmount,
            soLuong: soLuong,
            ghiChu: '',
          }
        })
        .filter((item) => item !== null) as SupplementaryFoodItem[]

    setSupplementaryFoods([...supplementaryFoods, ...newSupplementaryFoods])
    setShowSupplementaryModal(false)
    setSelectedSupplementaryIngredients([])
    setSupplementaryAmount(1) // CHANGED: Reset to 1 instead of 0
  }

  // Update supplementary food định mức (NEW) - Auto recalculate soLuong based on soSuat
  const handleUpdateSupplementaryDinhMuc = (id: string, newDinhMuc: number) => {
    if (newDinhMuc < 0) return

    // Round to 2 decimals
    const roundedDinhMuc = Math.round(newDinhMuc * 100) / 100

    setSupplementaryFoods(
      supplementaryFoods.map((item) => {
        if (item.id === id) {
          // Recalculate soLuong = dinhMuc * soSuat
          const newSoLuong =
            Math.round(roundedDinhMuc * item.soSuat * 100) / 100

          return {
            ...item,
            dinhMuc: roundedDinhMuc,
            soLuong: newSoLuong,
          }
        }
        return item
      }),
    )
  }

  // Update supplementary food soSuat (NEW) - Auto recalculate soLuong
  const handleUpdateSupplementarySoSuat = (id: string, newSoSuat: number) => {
    if (newSoSuat <= 0) return

    // Round to 2 decimals
    const roundedSoSuat = Math.round(newSoSuat * 100) / 100

    setSupplementaryFoods(
      supplementaryFoods.map((item) => {
        if (item.id === id) {
          // Recalculate soLuong = dinhMuc * soSuat
          const newSoLuong =
            Math.round(item.dinhMuc * roundedSoSuat * 100) / 100

          return {
            ...item,
            soSuat: roundedSoSuat,
            soLuong: newSoLuong,
          }
        }
        return item
      }),
    )
  }

  // Update supplementary food note
  const handleUpdateSupplementaryNote = (id: string, note: string) => {
    setSupplementaryFoods(
      supplementaryFoods.map((item) =>
        item.id === id ? { ...item, ghiChu: note } : item,
      ),
    )
  }

  // Remove supplementary food
  const handleRemoveSupplementaryFood = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thực phẩm bổ sung này?')) {
      setSupplementaryFoods(supplementaryFoods.filter((item) => item.id !== id))
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phieuLenDonId.trim()) {
      setError('Vui lòng nhập mã phiếu lên đơn')
      return
    }

    if (!bepId.trim()) {
      setError('Vui lòng chọn bếp')
      return
    }

    if (orderDishes.length === 0 && supplementaryFoods.length === 0) {
      setError('Vui lòng thêm ít nhất một món ăn hoặc thực phẩm bổ sung')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const orderData: CreateOrderInput = {
        kitchenId: bepId,
        orderDate: ngayLen,
        note: ghiChu,
        status: 'Pending',
        details: orderDishes.map((dish) => ({
          dishId: dish.monanId,
          portions: dish.soSuat,
          note: '',
          ingredients: dish.ingredients.map((ing) => ({
            ingredientId: ing.nguyenLieuId,
            quantity: ing.soLuong,
            unit: ing.donViTinh,
            standardPerPortion: ing.dinhMuc,
          })),
        })),
        supplementaryFoods: supplementaryFoods.map((item) => ({
          ingredientId: item.nguyenLieuId,
          quantity: item.soLuong,
          unit: item.donViTinh,
          standardPerPortion: item.dinhMuc,
          portions: item.soSuat,
          note: item.ghiChu || '',
        })),
      }

      const createdOrder = await orderApi.create(orderData)

      setSuccess('Tạo phiếu lên đơn thành công!')

      // Redirect to order detail page with the new order ID
      setTimeout(() => {
        router.push(`/orders/${createdOrder.orderId}`)
      }, 1500)
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi tạo phiếu lên đơn'
      setError(errorMessage)
      console.error(err)
      // Ensure error alert is visible
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  // Filter dishes by search
  const filteredDishes = availableDishes.filter((dish) =>
    dish.dishName.toLowerCase().includes(searchDish.toLowerCase()),
  )

  // Filter ingredients by search
  const filteredIngredients = availableIngredients.filter((ing) =>
    ing.ingredientName.toLowerCase().includes(searchIngredient.toLowerCase()),
  )

  // Filter kitchens by search
  const filteredKitchens = availableKitchens.filter(
    (kitchen) =>
      kitchen.kitchenName.toLowerCase().includes(searchKitchen.toLowerCase()) ||
      kitchen.kitchenId.toLowerCase().includes(searchKitchen.toLowerCase()),
  )

  // Select kitchen
  const handleSelectKitchen = (kitchen: Kitchen) => {
    setBepId(kitchen.kitchenId)
    setTenBep(kitchen.kitchenName)
    setShowKitchenModal(false)
    setSearchKitchen('')
  }

  // Calculate total ingredients - AUTO-UPDATES when orderDishes or supplementaryFoods change
  const getTotalIngredients = () => {
    const totals: {
      [key: string]: {
        tenNguyenLieu: string
        soLuong: number
        donViTinh: string
      }
    } = {}

    // From dishes
    orderDishes.forEach((dish) => {
      dish.ingredients.forEach((ing) => {
        if (totals[ing.nguyenLieuId]) {
          totals[ing.nguyenLieuId].soLuong += ing.soLuong
        } else {
          totals[ing.nguyenLieuId] = {
            tenNguyenLieu: ing.tenNguyenLieu,
            soLuong: ing.soLuong,
            donViTinh: ing.donViTinh,
          }
        }
      })
    })

    // From supplementary foods - AUTO-UPDATES
    supplementaryFoods.forEach((item) => {
      if (totals[item.nguyenLieuId]) {
        totals[item.nguyenLieuId].soLuong += item.soLuong
      } else {
        totals[item.nguyenLieuId] = {
          tenNguyenLieu: item.tenNguyenLieu,
          soLuong: item.soLuong,
          donViTinh: item.donViTinh,
        }
      }
    })

    // Round numbers to avoid too many decimals
    const roundNumber = (num: number): number => {
      // If number is very small, keep more precision
      if (num < 0.01) return Math.round(num * 10000) / 10000
      // If number is small, keep 2 decimals
      if (num < 1) return Math.round(num * 100) / 100
      // For normal numbers, keep 2 decimals
      return Math.round(num * 100) / 100
    }

    return Object.entries(totals).map(([id, data]) => ({
      nguyenLieuId: id,
      tenNguyenLieu: data.tenNguyenLieu,
      soLuong: roundNumber(data.soLuong),
      donViTinh: data.donViTinh,
    }))
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Order Header */}
        <Card className="mb-4">
          <CardBody>
            <h5 className="mb-3">Thông tin phiếu lên đơn</h5>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>
                    Mã phiếu lên đơn <span className="text-danger">*</span>
                  </FormLabel>
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={phieuLenDonId}
                      onChange={(e) => setPhieuLenDonId(e.target.value)}
                      placeholder="Ví dụ: PLD001"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={generateOrderId}
                      title="Tạo mã tự động"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Mã tự động theo thời gian, có thể chỉnh sửa
                  </Form.Text>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>
                    Bếp <span className="text-danger">*</span>
                  </FormLabel>
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={tenBep || bepId}
                      placeholder="Chọn bếp..."
                      readOnly
                      required
                      style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                      onClick={() => setShowKitchenModal(true)}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowKitchenModal(true)}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup>
                  {bepId && (
                    <Form.Text className="text-muted">
                      Mã bếp: {bepId}
                    </Form.Text>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Ngày lên đơn</FormLabel>
                  <FormControl
                    type="date"
                    value={ngayLen}
                    onChange={(e) => setNgayLen(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl
                    as="textarea"
                    rows={2}
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Order Dishes */}
        <Card className="mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Danh sách món ăn</h5>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowDishModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Thêm món
              </Button>
            </div>

            {orderDishes.length === 0 ? (
              <Alert variant="info">
                Chưa có món ăn nào. Nhấn &quot;Thêm món&quot; để bắt đầu.
              </Alert>
            ) : (
              <div>
                {orderDishes.map((dish, dishIndex) => (
                  <Card key={dish.id} className="mb-3 border">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">
                            {dish.tenMonAn}{' '}
                            <Badge bg="secondary">{dish.monanId}</Badge>
                          </h6>
                          <div className="d-flex align-items-center">
                            <span className="me-2">Số suất:</span>
                            <InputGroup style={{ width: '150px' }}>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() =>
                                  handleUpdatePortions(dish.id, dish.soSuat - 1)
                                }
                              >
                                -
                              </Button>
                              <FormControl
                                type="number"
                                min="1"
                                value={dish.soSuat}
                                onChange={(e) =>
                                  handleUpdatePortions(
                                    dish.id,
                                    parseInt(e.target.value) || 1,
                                  )
                                }
                                className="text-center"
                                size="sm"
                              />
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() =>
                                  handleUpdatePortions(dish.id, dish.soSuat + 1)
                                }
                              >
                                +
                              </Button>
                            </InputGroup>
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveDish(dish.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Nguyên liệu:</strong>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setCurrentDishIndex(dishIndex)
                              setShowIngredientModal(true)
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Thêm NL
                          </Button>
                        </div>
                        <Table size="sm" bordered>
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: '30%' }}>Tên nguyên liệu</th>
                              <th style={{ width: '20%' }}>Định mức/suất</th>
                              <th style={{ width: '25%' }}>Số lượng</th>
                              <th style={{ width: '10%' }}>ĐVT</th>
                              <th
                                style={{ width: '15%' }}
                                className="text-center"
                              >
                                Xóa
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dish.ingredients.map((ing) => (
                              <tr key={ing.nguyenLieuId}>
                                <td>{ing.tenNguyenLieu}</td>
                                <td>
                                  <FormControl
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ing.dinhMuc}
                                    onChange={(e) =>
                                      handleUpdateDinhMuc(
                                        dish.id,
                                        ing.nguyenLieuId,
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    size="sm"
                                  />
                                </td>
                                <td>
                                  <FormControl
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ing.soLuong}
                                    readOnly
                                    size="sm"
                                    style={{
                                      backgroundColor: '#f8f9fa',
                                      cursor: 'not-allowed',
                                    }}
                                    title="Số lượng tự động = Định mức × Số suất"
                                  />
                                </td>
                                <td>{ing.donViTinh}</td>
                                <td className="text-center">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="text-danger p-0"
                                    onClick={() =>
                                      handleRemoveIngredient(
                                        dish.id,
                                        ing.nguyenLieuId,
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Supplementary Foods (NEW SECTION) */}
        <Card className="mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Thực phẩm bổ sung</h5>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowSupplementaryModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Thêm thực phẩm
              </Button>
            </div>

            {supplementaryFoods.length === 0 ? (
              <Alert variant="info">
                Chưa có thực phẩm bổ sung. Nhấn &quot;Thêm thực phẩm&quot; để
                thêm các nguyên liệu cần mua thêm.
              </Alert>
            ) : (
              <Table striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '20%' }}>Tên nguyên liệu</th>
                    <th style={{ width: '12%' }}>Định mức/suất</th>
                    <th style={{ width: '12%' }}>Số suất</th>
                    <th style={{ width: '15%' }}>Số lượng</th>
                    <th style={{ width: '8%' }}>ĐVT</th>
                    <th style={{ width: '20%' }}>Ghi chú</th>
                    <th style={{ width: '8%' }} className="text-center">
                      Xóa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {supplementaryFoods.map((item) => (
                    <tr key={item.id}>
                      <td>{item.tenNguyenLieu}</td>
                      <td>
                        <FormControl
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.dinhMuc}
                          onChange={(e) =>
                            handleUpdateSupplementaryDinhMuc(
                              item.id,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          size="sm"
                        />
                      </td>
                      <td>
                        <FormControl
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.soSuat}
                          onChange={(e) =>
                            handleUpdateSupplementarySoSuat(
                              item.id,
                              parseFloat(e.target.value) || 1,
                            )
                          }
                          size="sm"
                        />
                      </td>
                      <td>
                        <FormControl
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.soLuong}
                          readOnly
                          size="sm"
                          style={{
                            backgroundColor: '#f8f9fa',
                            cursor: 'not-allowed',
                          }}
                          title="Số lượng tự động = Định mức × Số suất"
                        />
                      </td>
                      <td>{item.donViTinh}</td>
                      <td>
                        <FormControl
                          type="text"
                          value={item.ghiChu || ''}
                          onChange={(e) =>
                            handleUpdateSupplementaryNote(
                              item.id,
                              e.target.value,
                            )
                          }
                          placeholder="Ghi chú..."
                          size="sm"
                        />
                      </td>
                      <td className="text-center">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0"
                          onClick={() => handleRemoveSupplementaryFood(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Total Ingredients Summary - AUTO-UPDATES */}
        {(orderDishes.length > 0 || supplementaryFoods.length > 0) && (
          <Card className="mb-4">
            <CardBody>
              <h5 className="mb-3">Tổng hợp nguyên liệu</h5>
              <Table striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>Mã NL</th>
                    <th>Tên nguyên liệu</th>
                    <th className="text-end">Tổng số lượng</th>
                    <th>Đơn vị</th>
                  </tr>
                </thead>
                <tbody>
                  {getTotalIngredients().map((ing) => (
                    <tr key={ing.nguyenLieuId}>
                      <td>{ing.nguyenLieuId}</td>
                      <td>{ing.tenNguyenLieu}</td>
                      <td className="text-end">
                        <strong>{formatNumber(ing.soLuong)}</strong>
                      </td>
                      <td>{ing.donViTinh}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Đang xử lý...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Lưu phiếu lên đơn
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/orders')}
          >
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Hủy
          </Button>
        </div>
      </Form>

      {/* Modal: Select Kitchen */}
      <Modal
        show={showKitchenModal}
        onHide={() => {
          setShowKitchenModal(false)
          setSearchKitchen('')
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chọn bếp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Tìm kiếm bếp..."
                value={searchKitchen}
                onChange={(e) => setSearchKitchen(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredKitchens.length === 0 ? (
              <Alert variant="info">Không tìm thấy bếp</Alert>
            ) : (
              <div className="list-group">
                {filteredKitchens.map((kitchen) => (
                  <button
                    key={kitchen.kitchenId}
                    type="button"
                    className={`list-group-item list-group-item-action ${bepId === kitchen.kitchenId ? 'active' : ''
                      }`}
                    onClick={() => handleSelectKitchen(kitchen)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{kitchen.kitchenName}</h6>
                        <small
                          className={
                            bepId === kitchen.kitchenId
                              ? 'text-white'
                              : 'text-muted'
                          }
                        >
                          {kitchen.address}
                        </small>
                      </div>
                      <Badge
                        bg={bepId === kitchen.kitchenId ? 'light' : 'primary'}
                        text={bepId === kitchen.kitchenId ? 'dark' : 'white'}
                      >
                        {kitchen.kitchenId}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowKitchenModal(false)
              setSearchKitchen('')
            }}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Add Dishes (Multi-select) */}
      <Modal
        show={showDishModal}
        onHide={() => {
          setShowDishModal(false)
          setSelectedDishes([])
          setPortions(1)
          setSearchDish('')
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm món ăn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredDishes.length === 0 ? (
              <Alert variant="info">Không tìm thấy món ăn</Alert>
            ) : (
              <div>
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.dishId}
                    className={`border rounded p-3 mb-2 ${selectedDishes.includes(dish.dishId)
                      ? 'bg-primary text-white'
                      : ''
                      }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <FormCheck
                      type="checkbox"
                      id={`dish-${dish.dishId}`}
                      label={
                        <div>
                          <div className="d-flex justify-content-between">
                            <strong>{dish.dishName}</strong>
                            <Badge
                              bg={
                                selectedDishes.includes(dish.dishId)
                                  ? 'light'
                                  : 'secondary'
                              }
                              text={
                                selectedDishes.includes(dish.dishId)
                                  ? 'dark'
                                  : 'white'
                              }
                            >
                              {dish.dishId}
                            </Badge>
                          </div>
                          <small>
                            {dishRecipeStandards.get(dish.dishId)?.length || 0}{' '}
                            nguyên liệu
                          </small>
                        </div>
                      }
                      checked={selectedDishes.includes(dish.dishId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDishes([...selectedDishes, dish.dishId])
                        } else {
                          setSelectedDishes(
                            selectedDishes.filter((id) => id !== dish.dishId),
                          )
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedDishes.length > 0 && (
            <div className="mt-3">
              <Alert variant="success">
                Đã chọn {selectedDishes.length} món
              </Alert>
              <FormGroup>
                <FormLabel>Số suất (áp dụng cho tất cả món đã chọn):</FormLabel>
                <FormControl
                  type="number"
                  min="1"
                  value={portions}
                  onChange={(e) => setPortions(parseInt(e.target.value) || 1)}
                />
              </FormGroup>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDishModal(false)
              setSelectedDishes([])
              setPortions(1)
              setSearchDish('')
            }}
          >
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleAddDishes}
            disabled={selectedDishes.length === 0}
          >
            Thêm {selectedDishes.length} món
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Add Ingredients to Dish (Multi-select) */}
      <Modal
        show={showIngredientModal}
        onHide={() => {
          setShowIngredientModal(false)
          setSelectedIngredients([])
          setCustomAmount(0)
          setCurrentDishIndex(null)
          setSearchIngredient('')
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm nguyên liệu vào món</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Tìm kiếm nguyên liệu..."
                value={searchIngredient}
                onChange={(e) => setSearchIngredient(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filteredIngredients.length === 0 ? (
              <Alert variant="info">Không tìm thấy nguyên liệu</Alert>
            ) : (
              <div>
                {filteredIngredients.map((ing) => (
                  <div
                    key={ing.ingredientId}
                    className={`border rounded p-2 mb-2 ${selectedIngredients.includes(ing.ingredientId)
                      ? 'bg-primary text-white'
                      : ''
                      }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <FormCheck
                      type="checkbox"
                      id={`ing-${ing.ingredientId}`}
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>{ing.ingredientName}</span>
                          <Badge
                            bg={
                              selectedIngredients.includes(ing.ingredientId)
                                ? 'light'
                                : 'secondary'
                            }
                            text={
                              selectedIngredients.includes(ing.ingredientId)
                                ? 'dark'
                                : 'white'
                            }
                          >
                            {ing.unit}
                          </Badge>
                        </div>
                      }
                      checked={selectedIngredients.includes(ing.ingredientId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIngredients([
                            ...selectedIngredients,
                            ing.ingredientId,
                          ])
                        } else {
                          setSelectedIngredients(
                            selectedIngredients.filter(
                              (id) => id !== ing.ingredientId,
                            ),
                          )
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedIngredients.length > 0 && (
            <div className="mt-3">
              <Alert variant="success">
                Đã chọn {selectedIngredients.length} nguyên liệu
              </Alert>
              <FormGroup>
                <FormLabel>
                  Số lượng (áp dụng cho tất cả nguyên liệu đã chọn):
                </FormLabel>
                <FormControl
                  type="number"
                  step="0.01"
                  min="0"
                  value={customAmount}
                  onChange={(e) =>
                    setCustomAmount(parseFloat(e.target.value) || 0)
                  }
                />
              </FormGroup>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowIngredientModal(false)
              setSelectedIngredients([])
              setCustomAmount(0)
              setCurrentDishIndex(null)
              setSearchIngredient('')
            }}
          >
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleAddCustomIngredients}
            disabled={selectedIngredients.length === 0 || customAmount <= 0}
          >
            Thêm {selectedIngredients.length} nguyên liệu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Add Supplementary Foods (Multi-select) - UPDATED DEFAULT */}
      <Modal
        show={showSupplementaryModal}
        onHide={() => {
          setShowSupplementaryModal(false)
          setSelectedSupplementaryIngredients([])
          setSupplementaryAmount(1) // CHANGED: Reset to 1
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm thực phẩm bổ sung</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Tìm kiếm nguyên liệu..."
                value={searchIngredient}
                onChange={(e) => setSearchIngredient(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredIngredients.length === 0 ? (
              <Alert variant="info">Không tìm thấy nguyên liệu</Alert>
            ) : (
              <div>
                {filteredIngredients.map((ing) => (
                  <div
                    key={ing.ingredientId}
                    className={`border rounded p-2 mb-2 ${selectedSupplementaryIngredients.includes(
                      ing.ingredientId,
                    )
                      ? 'bg-success text-white'
                      : ''
                      }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <FormCheck
                      type="checkbox"
                      id={`supp-${ing.ingredientId}`}
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>{ing.ingredientName}</span>
                          <Badge
                            bg={
                              selectedSupplementaryIngredients.includes(
                                ing.ingredientId,
                              )
                                ? 'light'
                                : 'secondary'
                            }
                            text={
                              selectedSupplementaryIngredients.includes(
                                ing.ingredientId,
                              )
                                ? 'dark'
                                : 'white'
                            }
                          >
                            {ing.unit}
                          </Badge>
                        </div>
                      }
                      checked={selectedSupplementaryIngredients.includes(
                        ing.ingredientId,
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSupplementaryIngredients([
                            ...selectedSupplementaryIngredients,
                            ing.ingredientId,
                          ])
                        } else {
                          setSelectedSupplementaryIngredients(
                            selectedSupplementaryIngredients.filter(
                              (id) => id !== ing.ingredientId,
                            ),
                          )
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSupplementaryIngredients.length > 0 && (
            <div className="mt-3">
              <Alert variant="success">
                Đã chọn {selectedSupplementaryIngredients.length} nguyên liệu
              </Alert>
              <FormGroup>
                <FormLabel>
                  Số suất (áp dụng cho tất cả nguyên liệu đã chọn):
                </FormLabel>
                <Form.Text className="text-muted d-block mb-2">
                  Số lượng sẽ được tính tự động: Định mức × Số suất
                </Form.Text>
                <FormControl
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={supplementaryAmount}
                  onChange={(e) =>
                    setSupplementaryAmount(parseFloat(e.target.value) || 1)
                  }
                />
              </FormGroup>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowSupplementaryModal(false)
              setSelectedSupplementaryIngredients([])
              setSupplementaryAmount(1) // CHANGED: Reset to 1
            }}
          >
            Đóng
          </Button>
          <Button
            variant="success"
            onClick={handleAddSupplementaryFoods}
            disabled={
              selectedSupplementaryIngredients.length === 0 ||
              supplementaryAmount <= 0
            }
          >
            Thêm {selectedSupplementaryIngredients.length} thực phẩm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
