'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Form,
  Button,
  Alert,
  Spinner,
  FormGroup,
  FormLabel,
  FormControl,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faTimes,
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
import OrderHeaderForm from './components/OrderHeaderForm'
import DishList from './components/DishList'
import SupplementaryFoodList from './components/SupplementaryFoodList'
import TotalIngredientsSummary from './components/TotalIngredientsSummary'

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
  const [bestSupplierByIngredient, setBestSupplierByIngredient] = useState<
    Record<string, BestSupplier | null>
  >({})

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
            kitchenId: bepId || undefined,
          },
        )

        data = response as BestSupplierResponse
      }

      // Process best suppliers
      const newSelections: Record<string, number> = {}
      const newAvailableSuppliers: Record<string, SupplierPrice[]> = {}
      const newBestSuppliers: Record<string, BestSupplier | null> = {}

      for (const ingData of data.ingredients) {
        const ingId = ingData.ingredientId

        // Store best supplier info
        newBestSuppliers[ingId] = ingData.bestSupplier || null

        // Create supplier data from bestSupplier info if available
        let bestSupplierData: SupplierPrice | null = null
        if (ingData.bestSupplier) {
          newSelections[ingId] = ingData.bestSupplier.productId

          bestSupplierData = {
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
            totalCost: ingData.bestSupplier.totalCost,
            isBestSupplier: true,
            isFavorite: ingData.bestSupplier.isFavorite,
            isLowestPrice: ingData.bestSupplier.isLowestPrice,
          }
          }

        // Load all available suppliers for this ingredient
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

          // If we have a best supplier, ensure it's in the list and mark it
          if (bestSupplierData) {
            // Check if best supplier already exists in the list
            const existingIndex = activeSuppliers.findIndex(
              (s) => s.productId === bestSupplierData!.productId,
            )

            if (existingIndex >= 0) {
              // Update existing supplier with best supplier info
              activeSuppliers[existingIndex] = {
                ...activeSuppliers[existingIndex],
                ...bestSupplierData,
              }
            } else {
              // Add best supplier to the beginning of the list
              activeSuppliers.unshift(bestSupplierData)
            }
          }

            newAvailableSuppliers[ingId] = activeSuppliers
          } catch (err) {
            console.error(
              `Failed to load suppliers for ingredient ${ingId}:`,
              err,
            )
          // If we have a best supplier but failed to load others, still show the best supplier
          newAvailableSuppliers[ingId] = bestSupplierData ? [bestSupplierData] : []
        }
      }

      // Merge with existing selections (keep user's manual selections)
      setSupplierSelections((prev) => ({
        ...newSelections,
        ...prev, // User selections take priority
      }))

      setAvailableSuppliersByIngredient(newAvailableSuppliers)
      setBestSupplierByIngredient(newBestSuppliers)

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

  // Auto-load best suppliers when ingredients or kitchen change
  useEffect(() => {
    const totalIngredients = calculateTotalIngredients()
    if (totalIngredients.length > 0 && orderId && bepId) {
      loadBestSuppliers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDishes, supplementaryFoods, orderId, bepId])

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
        <OrderHeaderForm
          orderId={orderId}
          ngayLen={ngayLen}
          tenBep={tenBep}
          ghiChu={ghiChu}
          onOrderIdChange={setOrderId}
          onDateChange={setNgayLen}
          onKitchenSelect={() => setShowKitchenModal(true)}
          onNoteChange={setGhiChu}
        />

        {/* Dishes Section */}
        <DishList
          dishes={orderDishes}
          onAddDish={() => setShowDishModal(true)}
          onPortionsChange={handleUpdatePortions}
          onDinhMucChange={handleUpdateDinhMuc}
          onRemoveIngredient={handleRemoveIngredient}
          onAddIngredient={(index) => {
            setCurrentDishIndex(index)
            setShowIngredientModal(true)
          }}
          onRemoveDish={handleRemoveDish}
          formatNumber={formatNumber}
        />

        {/* Supplementary Foods Section */}
        <SupplementaryFoodList
          items={supplementaryFoods}
          onAdd={() => setShowSupplementaryModal(true)}
          onDinhMucChange={handleUpdateSupplementaryDinhMuc}
          onSoSuatChange={handleUpdateSupplementarySoSuat}
          onNoteChange={handleUpdateSupplementaryNote}
          onRemove={handleRemoveSupplementaryFood}
          formatNumber={formatNumber}
        />

        {/* Total Ingredients Summary with Supplier Selection */}
        <TotalIngredientsSummary
          ingredients={totalIngredients}
          loading={loadingBestSuppliers}
          availableSuppliers={availableSuppliersByIngredient}
          supplierSelections={supplierSelections}
          bestSuppliers={bestSupplierByIngredient}
          onRefresh={() => loadBestSuppliers()}
          onSupplierChange={handleSupplierChange}
          formatNumber={formatNumber}
        />

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
