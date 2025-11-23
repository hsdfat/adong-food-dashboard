'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
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
  FormSelect,
  Spinner,
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
  faSync,
} from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'
import {
  kitchenApi,
  dishApi,
  ingredientApi,
  recipeStandardApi,
  orderApi,
} from '@/services'
import { Kitchen, RecipeStandard } from '@/models'
import { Dish as DishModel, Ingredient as IngredientModel } from '@/models'
import { CreateOrderInput } from '@/models/order'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { SupplierPrice } from '@/models/supplier-price'
import SingleSelectionModal from '@/components/Common/SingleSelectionModal'
import MultiSelectionModal from '@/components/Common/MultiSelectionModal'

// ==================== TYPE DEFINITIONS ====================

interface OrderIngredient {
  nguyenLieuId: string
  tenNguyenLieu: string
  donViTinh: string
  dinhMuc: number
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
  soSuat: number
  soLuong: number
  ghiChu?: string
}

interface TotalIngredient {
  ingredientId: string
  ingredientName: string
  totalQuantity: number
  unit: string
}

interface BestSupplier {
  productId: number
  productName: string
  supplierId: string
  supplierName: string
  unitPrice: number
  unit: string
  specification: string
  isFavorite: boolean
  isLowestPrice: boolean
  totalCost: number
}

interface BestSupplierResponse {
  ingredients: Array<{
    ingredientId: string
    ingredientName: string
    totalQuantity: number
    unit: string
    bestSupplier: BestSupplier | null
  }>
}

interface OrderFormProps {
  orderId?: string
  isEdit?: boolean
  preFillData?: any // Data to pre-fill the form with
}

// ==================== MAIN COMPONENT ====================

export default function OrderForm({
  orderId: existingOrderId,
  isEdit = false,
  preFillData,
}: OrderFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const isSubmittingRef = useRef(false)

  // ==================== STATE MANAGEMENT ====================

  // Loading & Error States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Order Header States
  const [orderId, setOrderId] = useState('')
  const [bepId, setBepId] = useState('')
  const [tenBep, setTenBep] = useState('')
  const [ngayLen, setNgayLen] = useState(new Date().toISOString().split('T')[0])
  const [ghiChu, setGhiChu] = useState('')

  // Kitchen Modal States
  const [showKitchenModal, setShowKitchenModal] = useState(false)
  const [availableKitchens, setAvailableKitchens] = useState<Kitchen[]>([])
  const [searchKitchen, setSearchKitchen] = useState('')

  // Order Content States
  const [orderDishes, setOrderDishes] = useState<OrderDishItem[]>([])
  const [supplementaryFoods, setSupplementaryFoods] = useState<
    SupplementaryFoodItem[]
  >([])

  // Dish Modal States
  const [showDishModal, setShowDishModal] = useState(false)
  const [availableDishes, setAvailableDishes] = useState<DishModel[]>([])
  const [dishRecipeStandards, setDishRecipeStandards] = useState<
    Map<string, RecipeStandard[]>
  >(new Map())
  const [searchDish, setSearchDish] = useState('')
  const [selectedDishes, setSelectedDishes] = useState<string[]>([])
  const [portions, setPortions] = useState(1)

  // Ingredient Modal States
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [currentDishIndex, setCurrentDishIndex] = useState<number | null>(null)
  const [availableIngredients, setAvailableIngredients] = useState<
    IngredientModel[]
  >([])
  const [searchIngredient, setSearchIngredient] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [customAmount, setCustomAmount] = useState(0)

  // Supplementary Food Modal States
  const [showSupplementaryModal, setShowSupplementaryModal] = useState(false)
  const [
    selectedSupplementaryIngredients,
    setSelectedSupplementaryIngredients,
  ] = useState<string[]>([])
  const [supplementaryAmount, setSupplementaryAmount] = useState(1)

  // Supplier Selection States
  const [loadingBestSuppliers, setLoadingBestSuppliers] = useState(false)
  const [supplierSelections, setSupplierSelections] = useState<
    Record<string, number | ''>
  >({})
  const [availableSuppliersByIngredient, setAvailableSuppliersByIngredient] =
    useState<Record<string, SupplierPrice[]>>({})

  // ==================== INITIALIZATION ====================

  useEffect(() => {
    initializeForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Function to pre-fill form with provided data
  const preFillFormWithBestSuppliers = (bestSuppliersData: any) => {
    // Set order ID and kitchen ID from the provided data
    if (bestSuppliersData.orderId) {
      setOrderId(bestSuppliersData.orderId)
    }
    if (bestSuppliersData.kitchenId) {
      setBepId(bestSuppliersData.kitchenId)
      // Find and set kitchen name
      const kitchen = availableKitchens.find(
        (k) => k.kitchenId === bestSuppliersData.kitchenId,
      )
      if (kitchen) {
        setTenBep(kitchen.kitchenName)
      }
    }

    // Convert ingredients to supplementary foods (since we only have ingredient data)
    const supplementaryItems: SupplementaryFoodItem[] =
      bestSuppliersData.ingredients.map((ing: any, index: number) => ({
        id: `prefill-${index}`,
        nguyenLieuId: ing.ingredientId,
        tenNguyenLieu: ing.ingredientName,
        donViTinh: ing.unit,
        dinhMuc: 0, // No standard per portion for supplementary items
        soSuat: 1, // Default to 1 portion
        soLuong: ing.totalQuantity,
        ghiChu: '',
      }))

    setSupplementaryFoods(supplementaryItems)

    // Load best suppliers after setting up the ingredients
    setTimeout(() => {
      loadBestSuppliers(bestSuppliersData.orderId, bestSuppliersData)
    }, 100)
  }

  const initializeForm = async () => {
    generateOrderId()
    await Promise.all([loadKitchens(), loadDishes(), loadIngredients()])

    // If pre-fill data is provided, use it after loading all data
    if (preFillData) {
      preFillFormWithBestSuppliers(preFillData)
    }
  }

  // ==================== DATA LOADING FUNCTIONS ====================

  const generateOrderId = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    setOrderId(`PLD${year}${month}${day}${hours}${minutes}${seconds}`)
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
      await Promise.all(
        dishes.map(async (dish) => {
          try {
            const recipeResponse = await recipeStandardApi.getByDish(
              dish.dishId,
            )
            recipeStandardsMap.set(dish.dishId, recipeResponse.data || [])
          } catch (err) {
            console.error(
              `Failed to load recipe standards for dish ${dish.dishId}:`,
              err,
            )
            recipeStandardsMap.set(dish.dishId, [])
          }
        }),
      )
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

  // ==================== SUPPLIER MANAGEMENT ====================

  const loadBestSuppliers = async (
    tempOrderId?: string,
    bestSuppliersData?: any,
  ) => {
    if (!orderId && !tempOrderId) return

    try {
      setLoadingBestSuppliers(true)
      let data: BestSupplierResponse

      // If bestSuppliersData is provided, use it directly (for testing/pre-filled data)
      if (bestSuppliersData) {
        data = bestSuppliersData
      } else {
        // Otherwise call API to get best suppliers
        const totalIngredients = calculateTotalIngredients()

        if (totalIngredients.length === 0) {
          console.log('No ingredients to get best suppliers for')
          return
        }

        const ingredientsPayload = totalIngredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          ingredientName: ing.ingredientName,
          totalQuantity: ing.totalQuantity,
          unit: ing.unit,
        }))

        const response = await orderApi.getBestSuppliers(
          tempOrderId || orderId,
          {
            ingredients: ingredientsPayload,
          },
        )

        data = response as BestSupplierResponse
      }

      // Process best suppliers
      const newSelections: Record<string, number> = {}
      const newAvailableSuppliers: Record<string, SupplierPrice[]> = {}

      for (const ingData of data.ingredients) {
        const ingId = ingData.ingredientId

        // If there's a best supplier, set it as selected and create supplier data
        if (ingData.bestSupplier) {
          newSelections[ingId] = ingData.bestSupplier.productId

          // Create supplier data from bestSupplier info
          const bestSupplierData: SupplierPrice = {
            productId: ingData.bestSupplier.productId,
            productName: ingData.bestSupplier.productName,
            ingredientId: ingId,
            ingredientName: ingData.ingredientName,
            category: '',
            supplierId: ingData.bestSupplier.supplierId,
            supplierName: ingData.bestSupplier.supplierName,
            manufacturer: '',
            unit: ingData.bestSupplier.unit,
            specification: ingData.bestSupplier.specification,
            unitPrice: ingData.bestSupplier.unitPrice,
            pricePer1: ingData.bestSupplier.unitPrice,
            effectiveFrom: new Date().toISOString(),
            effectiveTo: null,
            active: true,
            newPrice: ingData.bestSupplier.unitPrice,
            promotion: ingData.bestSupplier.isFavorite
              ? 'Yêu thích'
              : ingData.bestSupplier.isLowestPrice
                ? 'Giá tốt nhất'
                : '',
          }

          newAvailableSuppliers[ingId] = [bestSupplierData]
        } else {
          // Load all available suppliers for this ingredient if no best supplier
          try {
            const suppliersResponse =
              await supplierPriceApi.getByIngredient(ingId)
            let suppliers: SupplierPrice[] = []

            if (
              suppliersResponse &&
              typeof suppliersResponse === 'object' &&
              'data' in suppliersResponse
            ) {
              suppliers = suppliersResponse.data as SupplierPrice[]
            } else if (Array.isArray(suppliersResponse)) {
              suppliers = suppliersResponse
            }

            // Filter active suppliers
            const activeSuppliers = suppliers.filter((s) => s.active !== false)
            newAvailableSuppliers[ingId] = activeSuppliers
          } catch (err) {
            console.error(
              `Failed to load suppliers for ingredient ${ingId}:`,
              err,
            )
            newAvailableSuppliers[ingId] = []
          }
        }
      }

      // Merge with existing selections (keep user's manual selections)
      setSupplierSelections((prev) => ({
        ...newSelections,
        ...prev, // User selections take priority
      }))

      setAvailableSuppliersByIngredient(newAvailableSuppliers)

      console.log('Best suppliers loaded:', {
        totalIngredients: data.ingredients.length,
        autoSelected: Object.keys(newSelections).length,
      })
    } catch (err: any) {
      console.error('Failed to load best suppliers:', err)
      // Don't show error to user, just log it
    } finally {
      setLoadingBestSuppliers(false)
    }
  }

  // Auto-load best suppliers when ingredients change
  useEffect(() => {
    const totalIngredients = calculateTotalIngredients()
    if (totalIngredients.length > 0 && orderId) {
      loadBestSuppliers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDishes, supplementaryFoods, orderId])

  const handleSupplierChange = (ingredientId: string, productIdStr: string) => {
    const productId = productIdStr ? parseInt(productIdStr, 10) : ''
    setSupplierSelections((prev) => ({
      ...prev,
      [ingredientId]: productId,
    }))
  }

  // ==================== DISH MANAGEMENT ====================

  const handleAddDishes = () => {
    if (selectedDishes.length === 0 || portions <= 0) {
      alert('Vui lòng chọn món ăn và nhập số suất hợp lệ')
      return
    }

    const newDishes: OrderDishItem[] = selectedDishes.map((dishId) => {
      const dish = availableDishes.find((d) => d.dishId === dishId)!
      const recipeStandards = dishRecipeStandards.get(dishId) || []

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
    closeDishModal()
  }

  const handleRemoveDish = (dishId: string) => {
    if (confirm('Bạn có chắc muốn xóa món này?')) {
      setOrderDishes(orderDishes.filter((d) => d.id !== dishId))
    }
  }

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

  const handleUpdateDinhMuc = (
    dishId: string,
    ingredientId: string,
    newDinhMuc: number,
  ) => {
    if (newDinhMuc < 0) return

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

  // ==================== INGREDIENT MANAGEMENT ====================

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
    closeIngredientModal()
  }

  // ==================== SUPPLEMENTARY FOOD MANAGEMENT ====================

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
    closeSupplementaryModal()
  }

  const handleUpdateSupplementaryDinhMuc = (id: string, newDinhMuc: number) => {
    if (newDinhMuc < 0) return

    const roundedDinhMuc = Math.round(newDinhMuc * 100) / 100

    setSupplementaryFoods(
      supplementaryFoods.map((item) => {
        if (item.id === id) {
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

  const handleUpdateSupplementarySoSuat = (id: string, newSoSuat: number) => {
    if (newSoSuat <= 0) return

    const roundedSoSuat = Math.round(newSoSuat * 100) / 100

    setSupplementaryFoods(
      supplementaryFoods.map((item) => {
        if (item.id === id) {
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

  const handleUpdateSupplementaryNote = (id: string, note: string) => {
    setSupplementaryFoods(
      supplementaryFoods.map((item) =>
        item.id === id ? { ...item, ghiChu: note } : item,
      ),
    )
  }

  const handleRemoveSupplementaryFood = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thực phẩm bổ sung này?')) {
      setSupplementaryFoods(supplementaryFoods.filter((item) => item.id !== id))
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * 100) / 100
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

  const calculateTotalIngredients = (): TotalIngredient[] => {
    const totals: Record<string, TotalIngredient> = {}

    // From dishes
    orderDishes.forEach((dish) => {
      dish.ingredients.forEach((ing) => {
        if (totals[ing.nguyenLieuId]) {
          totals[ing.nguyenLieuId].totalQuantity += ing.soLuong
        } else {
          totals[ing.nguyenLieuId] = {
            ingredientId: ing.nguyenLieuId,
            ingredientName: ing.tenNguyenLieu,
            totalQuantity: ing.soLuong,
            unit: ing.donViTinh,
          }
        }
      })
    })

    // From supplementary foods
    supplementaryFoods.forEach((item) => {
      if (totals[item.nguyenLieuId]) {
        totals[item.nguyenLieuId].totalQuantity += item.soLuong
      } else {
        totals[item.nguyenLieuId] = {
          ingredientId: item.nguyenLieuId,
          ingredientName: item.tenNguyenLieu,
          totalQuantity: item.soLuong,
          unit: item.donViTinh,
        }
      }
    })

    return Object.values(totals)
  }

  // ==================== MODAL HANDLERS ====================

  const handleSelectKitchen = (kitchen: Kitchen) => {
    setBepId(kitchen.kitchenId)
    setTenBep(kitchen.kitchenName)
    closeKitchenModal()
  }

  const closeKitchenModal = () => {
    setShowKitchenModal(false)
    setSearchKitchen('')
  }

  const closeDishModal = () => {
    setShowDishModal(false)
    setSelectedDishes([])
    setPortions(1)
    setSearchDish('')
  }

  const closeIngredientModal = () => {
    setShowIngredientModal(false)
    setSelectedIngredients([])
    setCustomAmount(0)
    setCurrentDishIndex(null)
    setSearchIngredient('')
  }

  const closeSupplementaryModal = () => {
    setShowSupplementaryModal(false)
    setSelectedSupplementaryIngredients([])
    setSupplementaryAmount(1)
  }

  // ==================== FORM SUBMISSION ====================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmittingRef.current || loading) {
      console.warn('Form submission already in progress')
      return
    }

    isSubmittingRef.current = true

    // Validation
    if (!orderId.trim()) {
      setError('Vui lòng nhập mã phiếu lên đơn')
      isSubmittingRef.current = false
      return
    }

    if (!bepId.trim()) {
      setError('Vui lòng chọn bếp')
      isSubmittingRef.current = false
      return
    }

    if (orderDishes.length === 0 && supplementaryFoods.length === 0) {
      setError('Vui lòng thêm ít nhất một món ăn hoặc thực phẩm bổ sung')
      isSubmittingRef.current = false
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const orderData: CreateOrderInput = {
        orderId: orderId,
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

      // Redirect to order detail page
      setTimeout(() => {
        router.push(`/orders/${createdOrder.orderId}`)
      }, 1500)
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi tạo phiếu lên đơn'
      setError(errorMessage)
      console.error(err)
      setSuccess('')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // ==================== COMPUTED VALUES ====================

  const filteredDishes = useMemo(
    () =>
      availableDishes.filter((dish) =>
        dish.dishName.toLowerCase().includes(searchDish.toLowerCase()),
      ),
    [availableDishes, searchDish],
  )

  const filteredIngredients = useMemo(
    () =>
      availableIngredients.filter((ing) =>
        ing.ingredientName
          .toLowerCase()
          .includes(searchIngredient.toLowerCase()),
      ),
    [availableIngredients, searchIngredient],
  )

  const filteredKitchens = useMemo(
    () =>
      availableKitchens.filter(
        (kitchen) =>
          kitchen.kitchenName
            .toLowerCase()
            .includes(searchKitchen.toLowerCase()) ||
          kitchen.kitchenId.toLowerCase().includes(searchKitchen.toLowerCase()),
      ),
    [availableKitchens, searchKitchen],
  )

  const totalIngredients = useMemo(
    () => calculateTotalIngredients(),
    [orderDishes, supplementaryFoods],
  )

  // ==================== RENDER ====================

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {/* Alert Messages */}
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

        {/* Order Header */}
        <Card className="mb-4">
          <CardBody>
            <h5 className="mb-3">Thông tin phiếu lên đơn</h5>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Mã phiếu lên đơn *</FormLabel>
                  <FormControl
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Ngày lên đơn *</FormLabel>
                  <FormControl
                    type="date"
                    value={ngayLen}
                    onChange={(e) => setNgayLen(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Bếp *</FormLabel>
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={tenBep}
                      placeholder="Chọn bếp..."
                      readOnly
                      required
                    />
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowKitchenModal(true)}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl
                    as="textarea"
                    rows={1}
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Dishes Section */}
        <Card className="mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Danh sách món ăn</h5>
              <Button variant="primary" onClick={() => setShowDishModal(true)}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Thêm món ăn
              </Button>
            </div>

            {orderDishes.length === 0 ? (
              <Alert variant="info">
                Chưa có món ăn nào. Nhấn "Thêm món ăn" để bắt đầu.
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>#</th>
                      <th style={{ width: '25%' }}>Món ăn</th>
                      <th style={{ width: '10%' }}>Số suất</th>
                      <th style={{ width: '50%' }}>Nguyên liệu</th>
                      <th style={{ width: '10%' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDishes.map((dish, index) => (
                      <tr key={dish.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{dish.tenMonAn}</strong>
                          <br />
                          <small className="text-muted">{dish.monanId}</small>
                        </td>
                        <td>
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
                            size="sm"
                          />
                        </td>
                        <td>
                          {dish.ingredients.length === 0 ? (
                            <small className="text-muted">
                              Chưa có nguyên liệu
                            </small>
                          ) : (
                            <Table size="sm" className="mb-0">
                              <tbody>
                                {dish.ingredients.map((ing) => (
                                  <tr key={ing.nguyenLieuId}>
                                    <td style={{ width: '40%' }}>
                                      {ing.tenNguyenLieu}
                                      <br />
                                      <small className="text-muted">
                                        {ing.nguyenLieuId}
                                      </small>
                                    </td>
                                    <td style={{ width: '20%' }}>
                                      <FormControl
                                        type="number"
                                        min="0"
                                        step="0.01"
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
                                      <small className="text-muted">
                                        {ing.donViTinh}/suất
                                      </small>
                                    </td>
                                    <td style={{ width: '30%' }}>
                                      <strong>
                                        {formatNumber(ing.soLuong)}
                                      </strong>{' '}
                                      {ing.donViTinh}
                                    </td>
                                    <td style={{ width: '10%' }}>
                                      <Button
                                        variant="danger"
                                        size="sm"
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
                          )}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setCurrentDishIndex(index)
                              setShowIngredientModal(true)
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Thêm nguyên liệu
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveDish(dish.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Supplementary Foods Section */}
        <Card className="mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Thực phẩm bổ sung</h5>
              <Button
                variant="success"
                onClick={() => setShowSupplementaryModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Thêm thực phẩm bổ sung
              </Button>
            </div>

            {supplementaryFoods.length === 0 ? (
              <Alert variant="info">
                Chưa có thực phẩm bổ sung. Nhấn "Thêm thực phẩm bổ sung" để thêm
                mới.
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>#</th>
                      <th style={{ width: '25%' }}>Nguyên liệu</th>
                      <th style={{ width: '15%' }}>Định mức</th>
                      <th style={{ width: '10%' }}>Số suất</th>
                      <th style={{ width: '15%' }}>Số lượng</th>
                      <th style={{ width: '20%' }}>Ghi chú</th>
                      <th style={{ width: '10%' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplementaryFoods.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{item.tenNguyenLieu}</strong>
                          <br />
                          <small className="text-muted">
                            {item.nguyenLieuId}
                          </small>
                        </td>
                        <td>
                          <FormControl
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.dinhMuc}
                            onChange={(e) =>
                              handleUpdateSupplementaryDinhMuc(
                                item.id,
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            size="sm"
                          />
                          <small className="text-muted">
                            {item.donViTinh}/suất
                          </small>
                        </td>
                        <td>
                          <FormControl
                            type="number"
                            min="1"
                            value={item.soSuat}
                            onChange={(e) =>
                              handleUpdateSupplementarySoSuat(
                                item.id,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            size="sm"
                          />
                        </td>
                        <td>
                          <strong>{formatNumber(item.soLuong)}</strong>{' '}
                          {item.donViTinh}
                        </td>
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
                            size="sm"
                            placeholder="Ghi chú..."
                          />
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveSupplementaryFood(item.id)
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
            )}
          </CardBody>
        </Card>

        {/* Total Ingredients Summary with Supplier Selection */}
        {totalIngredients.length > 0 && (
          <Card className="mb-4">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  Tổng hợp nguyên liệu & Chọn nhà cung cấp
                </h5>
                <Button
                  variant="outline-primary"
                  onClick={() => loadBestSuppliers()}
                  disabled={loadingBestSuppliers}
                >
                  {loadingBestSuppliers ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSync} className="me-2" />
                      Làm mới đề xuất
                    </>
                  )}
                </Button>
              </div>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>#</th>
                      <th style={{ width: '30%' }}>Nguyên liệu</th>
                      <th style={{ width: '15%' }}>Số lượng</th>
                      <th style={{ width: '50%' }}>Nhà cung cấp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalIngredients.map((ing, index) => {
                      const suppliers =
                        availableSuppliersByIngredient[ing.ingredientId] || []
                      const selectedProductId =
                        supplierSelections[ing.ingredientId]
                      const selectedSupplier = suppliers.find(
                        (s) => s.productId === selectedProductId,
                      )

                      return (
                        <tr key={ing.ingredientId}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{ing.ingredientName}</strong>
                            <br />
                            <small className="text-muted">
                              {ing.ingredientId}
                            </small>
                          </td>
                          <td>
                            <strong>{formatNumber(ing.totalQuantity)}</strong>{' '}
                            {ing.unit}
                          </td>
                          <td>
                            {loadingBestSuppliers ? (
                              <div className="text-center">
                                <Spinner animation="border" size="sm" />
                              </div>
                            ) : suppliers.length === 0 ? (
                              <Alert variant="warning" className="mb-0 py-2">
                                Không có nhà cung cấp
                              </Alert>
                            ) : (
                              <div>
                                <FormSelect
                                  value={selectedProductId || ''}
                                  onChange={(e) =>
                                    handleSupplierChange(
                                      ing.ingredientId,
                                      e.target.value,
                                    )
                                  }
                                  size="sm"
                                >
                                  <option value="">
                                    -- Chọn nhà cung cấp --
                                  </option>
                                  {suppliers.map((supplier) => (
                                    <option
                                      key={supplier.productId}
                                      value={supplier.productId}
                                    >
                                      {supplier.supplierName} -{' '}
                                      {supplier.productName} (
                                      {formatNumber(supplier.unitPrice)} đ/
                                      {supplier.unit})
                                      {supplier.promotion &&
                                        ` - ${supplier.promotion}`}
                                    </option>
                                  ))}
                                </FormSelect>
                                {selectedSupplier && (
                                  <div className="mt-2">
                                    <small className="text-muted">
                                      <strong>Chi tiết:</strong>{' '}
                                      {selectedSupplier.supplierName} (
                                      {selectedSupplier.supplierId})
                                      <br />
                                      <strong>Sản phẩm:</strong>{' '}
                                      {selectedSupplier.productName}
                                      <br />
                                      <strong>Đơn giá:</strong>{' '}
                                      {formatNumber(selectedSupplier.unitPrice)}{' '}
                                      đ/{selectedSupplier.unit}
                                      <br />
                                      <strong>Tổng tiền:</strong>{' '}
                                      {formatNumber(
                                        selectedSupplier.unitPrice *
                                          ing.totalQuantity,
                                      )}{' '}
                                      đ
                                      {selectedSupplier.specification && (
                                        <>
                                          <br />
                                          <strong>Quy cách:</strong>{' '}
                                          {selectedSupplier.specification}
                                        </>
                                      )}
                                      {selectedSupplier.promotion && (
                                        <>
                                          <br />
                                          <Badge bg="success">
                                            {selectedSupplier.promotion}
                                          </Badge>
                                        </>
                                      )}
                                    </small>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
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

      {/* Modals */}
      <SingleSelectionModal
        show={showKitchenModal}
        onHide={closeKitchenModal}
        title="Chọn bếp"
        items={filteredKitchens.map((k) => ({
          id: k.kitchenId,
          name: k.kitchenName,
          subtitle: k.address,
          badge: k.kitchenId,
          ...k,
        }))}
        searchValue={searchKitchen}
        onSearchChange={setSearchKitchen}
        selectedId={bepId}
        onSelect={(item) => handleSelectKitchen(item as Kitchen)}
        searchPlaceholder="Tìm kiếm bếp..."
        emptyMessage="Không tìm thấy bếp"
      />

      <MultiSelectionModal
        show={showDishModal}
        onHide={closeDishModal}
        title="Thêm món ăn"
        items={filteredDishes.map((d) => ({
          id: d.dishId,
          name: d.dishName,
          subtitle: `${dishRecipeStandards.get(d.dishId)?.length || 0} nguyên liệu`,
          badge: d.dishId,
          ...d,
        }))}
        searchValue={searchDish}
        onSearchChange={setSearchDish}
        selectedIds={selectedDishes}
        onSelect={(dishId, checked) => {
          if (checked) {
            setSelectedDishes([...selectedDishes, dishId])
          } else {
            setSelectedDishes(selectedDishes.filter((id) => id !== dishId))
          }
        }}
        onConfirm={handleAddDishes}
        searchPlaceholder="Tìm kiếm món ăn..."
        emptyMessage="Không tìm thấy món ăn"
        confirmLabel={`Thêm ${selectedDishes.length} món`}
        selectedCountLabel={`Đã chọn ${selectedDishes.length} món`}
        additionalFields={
          <FormGroup>
            <FormLabel>Số suất (áp dụng cho tất cả món đã chọn):</FormLabel>
            <FormControl
              type="number"
              min="1"
              value={portions}
              onChange={(e) => setPortions(parseInt(e.target.value) || 1)}
            />
          </FormGroup>
        }
      />

      <MultiSelectionModal
        show={showIngredientModal}
        onHide={closeIngredientModal}
        title="Thêm nguyên liệu vào món ăn"
        items={filteredIngredients.map((i) => ({
          id: i.ingredientId,
          name: i.ingredientName,
          subtitle: `${i.ingredientId} - ${i.unit}`,
          ...i,
        }))}
        searchValue={searchIngredient}
        onSearchChange={setSearchIngredient}
        selectedIds={selectedIngredients}
        onSelect={(ingId, checked) => {
          if (checked) {
            setSelectedIngredients([...selectedIngredients, ingId])
          } else {
            setSelectedIngredients(
              selectedIngredients.filter((id) => id !== ingId),
            )
          }
        }}
        onConfirm={handleAddCustomIngredients}
        searchPlaceholder="Tìm kiếm nguyên liệu..."
        emptyMessage="Không tìm thấy nguyên liệu"
        confirmLabel={`Thêm ${selectedIngredients.length} nguyên liệu`}
        selectedCountLabel={`Đã chọn ${selectedIngredients.length} nguyên liệu`}
        additionalFields={
          <FormGroup>
            <FormLabel>
              Số lượng (áp dụng cho tất cả nguyên liệu đã chọn):
            </FormLabel>
            <FormControl
              type="number"
              min="0"
              step="0.01"
              value={customAmount}
              onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
            />
          </FormGroup>
        }
      />

      <MultiSelectionModal
        show={showSupplementaryModal}
        onHide={closeSupplementaryModal}
        title="Thêm thực phẩm bổ sung"
        items={filteredIngredients.map((i) => ({
          id: i.ingredientId,
          name: i.ingredientName,
          subtitle: `${i.ingredientId} - ${i.unit}`,
          ...i,
        }))}
        searchValue={searchIngredient}
        onSearchChange={setSearchIngredient}
        selectedIds={selectedSupplementaryIngredients}
        onSelect={(ingId, checked) => {
          if (checked) {
            setSelectedSupplementaryIngredients([
              ...selectedSupplementaryIngredients,
              ingId,
            ])
          } else {
            setSelectedSupplementaryIngredients(
              selectedSupplementaryIngredients.filter((id) => id !== ingId),
            )
          }
        }}
        onConfirm={handleAddSupplementaryFoods}
        searchPlaceholder="Tìm kiếm nguyên liệu..."
        emptyMessage="Không tìm thấy nguyên liệu"
        confirmLabel={`Thêm ${selectedSupplementaryIngredients.length} thực phẩm`}
        selectedCountLabel={`Đã chọn ${selectedSupplementaryIngredients.length} nguyên liệu`}
        confirmVariant="success"
        selectedHighlightClass="bg-success text-white"
        additionalFields={
          <FormGroup>
            <FormLabel>
              Số suất (áp dụng cho tất cả nguyên liệu đã chọn):
            </FormLabel>
            <FormControl
              type="number"
              min="1"
              value={supplementaryAmount}
              onChange={(e) =>
                setSupplementaryAmount(parseInt(e.target.value) || 1)
              }
            />
            <small className="text-muted">
              Bạn có thể chỉnh sửa định mức và số lượng sau khi thêm
            </small>
          </FormGroup>
        }
      />
    </>
  )
}
