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

// Types
interface Ingredient {
  nguyenLieuId: string
  tenNguyenLieu: string
  donViTinh: string
  dinhMuc: number
}

interface Dish {
  dishId: string
  dishName: string
  ingredients: Ingredient[]
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
  const [ngayLen, setNgayLen] = useState(new Date().toISOString().split('T')[0])
  const [ghiChu, setGhiChu] = useState('')

  // Dishes in order
  const [orderDishes, setOrderDishes] = useState<OrderDishItem[]>([])

  // Supplementary foods (NEW)
  const [supplementaryFoods, setSupplementaryFoods] = useState<
    SupplementaryFoodItem[]
  >([])

  // Modal for adding dishes
  const [showDishModal, setShowDishModal] = useState(false)
  const [availableDishes, setAvailableDishes] = useState<Dish[]>([])
  const [searchDish, setSearchDish] = useState('')
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]) // Multi-select
  const [portions, setPortions] = useState(1)

  // Modal for adding ingredient to dish
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [currentDishIndex, setCurrentDishIndex] = useState<number | null>(null)
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([])
  const [searchIngredient, setSearchIngredient] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]) // Multi-select
  const [customAmount, setCustomAmount] = useState(0)

  // Modal for adding supplementary foods (NEW)
  const [showSupplementaryModal, setShowSupplementaryModal] = useState(false)
  const [
    selectedSupplementaryIngredients,
    setSelectedSupplementaryIngredients,
  ] = useState<string[]>([])
  const [supplementaryAmount, setSupplementaryAmount] = useState(0)

  // Load available dishes
  useEffect(() => {
    loadDishes()
    loadIngredients()
  }, [])

  const loadDishes = async () => {
    try {
      // TODO: Replace with actual API call
      const mockDishes: Dish[] = [
        {
          dishId: 'MA001',
          dishName: 'Canh chua cá',
          ingredients: [
            {
              nguyenLieuId: 'NL001',
              tenNguyenLieu: 'Cá lóc',
              donViTinh: 'kg',
              dinhMuc: 0.5,
            },
            {
              nguyenLieuId: 'NL002',
              tenNguyenLieu: 'Cà chua',
              donViTinh: 'kg',
              dinhMuc: 0.2,
            },
            {
              nguyenLieuId: 'NL003',
              tenNguyenLieu: 'Dứa',
              donViTinh: 'kg',
              dinhMuc: 0.15,
            },
          ],
        },
        {
          dishId: 'MA002',
          dishName: 'Thịt kho tàu',
          ingredients: [
            {
              nguyenLieuId: 'NL004',
              tenNguyenLieu: 'Thịt ba chỉ',
              donViTinh: 'kg',
              dinhMuc: 0.8,
            },
            {
              nguyenLieuId: 'NL005',
              tenNguyenLieu: 'Trứng',
              donViTinh: 'quả',
              dinhMuc: 10,
            },
          ],
        },
        {
          dishId: 'MA003',
          dishName: 'Rau muống xào tỏi',
          ingredients: [
            {
              nguyenLieuId: 'NL006',
              tenNguyenLieu: 'Rau muống',
              donViTinh: 'kg',
              dinhMuc: 1.5,
            },
            {
              nguyenLieuId: 'NL007',
              tenNguyenLieu: 'Tỏi',
              donViTinh: 'kg',
              dinhMuc: 0.05,
            },
          ],
        },
      ]
      setAvailableDishes(mockDishes)
    } catch (err) {
      console.error('Failed to load dishes:', err)
    }
  }

  const loadIngredients = async () => {
    try {
      // TODO: Replace with actual API call
      const mockIngredients = [
        {
          nguyenLieuId: 'NL008',
          tenNguyenLieu: 'Dầu ăn',
          donViTinh: 'lít',
        },
        { nguyenLieuId: 'NL009', tenNguyenLieu: 'Muối', donViTinh: 'kg' },
        { nguyenLieuId: 'NL010', tenNguyenLieu: 'Đường', donViTinh: 'kg' },
        {
          nguyenLieuId: 'NL011',
          tenNguyenLieu: 'Nước mắm',
          donViTinh: 'lít',
        },
        { nguyenLieuId: 'NL012', tenNguyenLieu: 'Hành tím', donViTinh: 'kg' },
        { nguyenLieuId: 'NL013', tenNguyenLieu: 'Gừng', donViTinh: 'kg' },
      ]
      setAvailableIngredients(mockIngredients)
    } catch (err) {
      console.error('Failed to load ingredients:', err)
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
      return {
        id: `${Date.now()}-${Math.random()}`,
        monanId: dish.dishId,
        tenMonAn: dish.dishName,
        soSuat: portions,
        ingredients: dish.ingredients.map((ing) => ({
          ...ing,
          soLuong: ing.dinhMuc * portions,
        })),
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
              soLuong: ing.dinhMuc * newPortions,
            })),
          }
        }
        return dish
      }),
    )
  }

  // Update ingredient amount
  const handleUpdateIngredientAmount = (
    dishId: string,
    ingredientId: string,
    newAmount: number,
  ) => {
    if (newAmount < 0) return

    setOrderDishes(
      orderDishes.map((dish) => {
        if (dish.id === dishId) {
          return {
            ...dish,
            ingredients: dish.ingredients.map((ing) =>
              ing.nguyenLieuId === ingredientId
                ? { ...ing, soLuong: newAmount }
                : ing,
            ),
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

    setOrderDishes(
      orderDishes.map((dish) => {
        if (dish.id === dishId) {
          return {
            ...dish,
            ingredients: dish.ingredients.map((ing) =>
              ing.nguyenLieuId === ingredientId
                ? {
                    ...ing,
                    dinhMuc: newDinhMuc,
                    soLuong: newDinhMuc * dish.soSuat,
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
          (ing) => ing.nguyenLieuId === ingId,
        )
        if (!ingredient) return null

        const exists = dish.ingredients.find(
          (ing) => ing.nguyenLieuId === ingId,
        )
        if (exists) return null

        return {
          nguyenLieuId: ingredient.nguyenLieuId,
          tenNguyenLieu: ingredient.tenNguyenLieu,
          donViTinh: ingredient.donViTinh,
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

  // Add multiple supplementary foods (NEW)
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
            (ing) => ing.nguyenLieuId === ingId,
          )
          if (!ingredient) return null

          return {
            id: `${Date.now()}-${Math.random()}`,
            nguyenLieuId: ingredient.nguyenLieuId,
            tenNguyenLieu: ingredient.tenNguyenLieu,
            donViTinh: ingredient.donViTinh,
            dinhMuc: 0,
            soLuong: supplementaryAmount,
            ghiChu: '',
          }
        })
        .filter((item) => item !== null) as SupplementaryFoodItem[]

    setSupplementaryFoods([...supplementaryFoods, ...newSupplementaryFoods])
    setShowSupplementaryModal(false)
    setSelectedSupplementaryIngredients([])
    setSupplementaryAmount(0)
  }

  // Update supplementary food amount
  const handleUpdateSupplementaryAmount = (id: string, newAmount: number) => {
    if (newAmount < 0) return
    setSupplementaryFoods(
      supplementaryFoods.map((item) =>
        item.id === id ? { ...item, soLuong: newAmount } : item,
      ),
    )
  }

  // Update supplementary food định mức (NEW)
  const handleUpdateSupplementaryDinhMuc = (id: string, newDinhMuc: number) => {
    if (newDinhMuc < 0) return
    setSupplementaryFoods(
      supplementaryFoods.map((item) =>
        item.id === id ? { ...item, dinhMuc: newDinhMuc } : item,
      ),
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
      const orderData = {
        phieuLenDonId,
        bepId,
        ngayLen: new Date(ngayLen),
        ghiChu,
        trangThai: 'Chờ xử lý',
        chiTiet: orderDishes.map((dish) => ({
          monanId: dish.monanId,
          tenMonAn: dish.tenMonAn,
          soSuat: dish.soSuat,
          listNguyenLieu: dish.ingredients.map((ing) => ({
            nguyenLieuId: ing.nguyenLieuId,
            tenNguyenLieu: ing.tenNguyenLieu,
            soLuong: ing.soLuong,
            donViTinh: ing.donViTinh,
            dinhMuc: ing.dinhMuc,
          })),
        })),
        thucPhamBoSung: supplementaryFoods.map((item) => ({
          nguyenLieuId: item.nguyenLieuId,
          tenNguyenLieu: item.tenNguyenLieu,
          soLuong: item.soLuong,
          donViTinh: item.donViTinh,
          dinhMuc: item.dinhMuc,
          ghiChu: item.ghiChu,
        })),
      }

      console.log('Order data to submit:', orderData)

      // TODO: Replace with actual API call
      // await orderApi.create(orderData)

      setSuccess('Tạo phiếu lên đơn thành công!')

      setTimeout(() => {
        router.push('/orders')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo phiếu lên đơn')
      console.error(err)
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
    ing.tenNguyenLieu.toLowerCase().includes(searchIngredient.toLowerCase()),
  )

  // Calculate total ingredients
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

    // From supplementary foods
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

    return Object.entries(totals).map(([id, data]) => ({
      nguyenLieuId: id,
      ...data,
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
                  <FormControl
                    type="text"
                    value={phieuLenDonId}
                    onChange={(e) => setPhieuLenDonId(e.target.value)}
                    placeholder="Ví dụ: PLD001"
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>
                    Bếp <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="text"
                    value={bepId}
                    onChange={(e) => setBepId(e.target.value)}
                    placeholder="Ví dụ: BEP001"
                    required
                  />
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
                                    onChange={(e) =>
                                      handleUpdateIngredientAmount(
                                        dish.id,
                                        ing.nguyenLieuId,
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    size="sm"
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
                    <th style={{ width: '25%' }}>Tên nguyên liệu</th>
                    <th style={{ width: '15%' }}>Định mức</th>
                    <th style={{ width: '20%' }}>Số lượng</th>
                    <th style={{ width: '10%' }}>ĐVT</th>
                    <th style={{ width: '20%' }}>Ghi chú</th>
                    <th style={{ width: '10%' }} className="text-center">
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
                          min="0"
                          value={item.soLuong}
                          onChange={(e) =>
                            handleUpdateSupplementaryAmount(
                              item.id,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          size="sm"
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

        {/* Total Ingredients Summary */}
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
                        <strong>{ing.soLuong.toFixed(2)}</strong>
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
                    className={`border rounded p-3 mb-2 ${
                      selectedDishes.includes(dish.dishId)
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
                          <small>{dish.ingredients.length} nguyên liệu</small>
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
                    key={ing.nguyenLieuId}
                    className={`border rounded p-2 mb-2 ${
                      selectedIngredients.includes(ing.nguyenLieuId)
                        ? 'bg-primary text-white'
                        : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <FormCheck
                      type="checkbox"
                      id={`ing-${ing.nguyenLieuId}`}
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>{ing.tenNguyenLieu}</span>
                          <Badge
                            bg={
                              selectedIngredients.includes(ing.nguyenLieuId)
                                ? 'light'
                                : 'secondary'
                            }
                            text={
                              selectedIngredients.includes(ing.nguyenLieuId)
                                ? 'dark'
                                : 'white'
                            }
                          >
                            {ing.donViTinh}
                          </Badge>
                        </div>
                      }
                      checked={selectedIngredients.includes(ing.nguyenLieuId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIngredients([
                            ...selectedIngredients,
                            ing.nguyenLieuId,
                          ])
                        } else {
                          setSelectedIngredients(
                            selectedIngredients.filter(
                              (id) => id !== ing.nguyenLieuId,
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

      {/* Modal: Add Supplementary Foods (Multi-select) */}
      <Modal
        show={showSupplementaryModal}
        onHide={() => {
          setShowSupplementaryModal(false)
          setSelectedSupplementaryIngredients([])
          setSupplementaryAmount(0)
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
                    key={ing.nguyenLieuId}
                    className={`border rounded p-2 mb-2 ${
                      selectedSupplementaryIngredients.includes(
                        ing.nguyenLieuId,
                      )
                        ? 'bg-success text-white'
                        : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <FormCheck
                      type="checkbox"
                      id={`supp-${ing.nguyenLieuId}`}
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>{ing.tenNguyenLieu}</span>
                          <Badge
                            bg={
                              selectedSupplementaryIngredients.includes(
                                ing.nguyenLieuId,
                              )
                                ? 'light'
                                : 'secondary'
                            }
                            text={
                              selectedSupplementaryIngredients.includes(
                                ing.nguyenLieuId,
                              )
                                ? 'dark'
                                : 'white'
                            }
                          >
                            {ing.donViTinh}
                          </Badge>
                        </div>
                      }
                      checked={selectedSupplementaryIngredients.includes(
                        ing.nguyenLieuId,
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSupplementaryIngredients([
                            ...selectedSupplementaryIngredients,
                            ing.nguyenLieuId,
                          ])
                        } else {
                          setSelectedSupplementaryIngredients(
                            selectedSupplementaryIngredients.filter(
                              (id) => id !== ing.nguyenLieuId,
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
                  Số lượng (áp dụng cho tất cả nguyên liệu đã chọn):
                </FormLabel>
                <FormControl
                  type="number"
                  step="0.01"
                  min="0"
                  value={supplementaryAmount}
                  onChange={(e) =>
                    setSupplementaryAmount(parseFloat(e.target.value) || 0)
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
              setSupplementaryAmount(0)
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
