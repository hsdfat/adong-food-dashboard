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
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  kitchenApi,
  dishApi,
  ingredientApi,
  recipeStandardApi,
  orderApi,
} from '@/services'
import { Kitchen, RecipeStandard , Dish as DishModel, Ingredient as IngredientModel } from '@/models'
import { CreateOrderInput } from '@/models/order'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { SupplierPrice } from '@/models/supplier-price'
import SingleSelectionModal from '@/components/Common/SingleSelectionModal'
import MultiSelectionModal from '@/components/Common/MultiSelectionModal'
import useOrderDictionary from './locales/use-order-dictionary'
import OrderHeaderForm from './components/OrderHeaderForm'
import DishList from './components/DishList'
import SupplementaryFoodList from './components/SupplementaryFoodList'
import TotalIngredientsSummary from './components/TotalIngredientsSummary'

// ==================== TYPE DEFINITIONS ====================

interface OrderIngredient {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  standardPerPortion: number;
}

interface OrderDishItem {
  id: string;
  dishId: string;
  dishName: string;
  portions: number;
  ingredients: {
    ingredientId: string;
    ingredientName: string;
    unit: string;
    standardPerPortion: number;
    quantity: number;
  }[];
}

interface SupplementaryFoodItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  standardPerPortion: number;
  portions: number;
  quantity: number;
  note?: string;
}

interface TotalIngredient {
  ingredientId: string;
  ingredientName: string;
  totalQuantity: number;
  unit: string;
}

interface BestSupplier {
  productId: number;
  productName: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  unit: string;
  specification: string;
  isFavorite: boolean;
  isLowestPrice: boolean;
  totalCost: number;
}

interface BestSupplierResponse {
  ingredients: Array<{
    ingredientId: string;
    ingredientName: string;
    totalQuantity: number;
    unit: string;
    bestSupplier: BestSupplier | null;
  }>;
}

interface OrderFormProps {
  orderId?: string;
  isEdit?: boolean;
  preFillData?: any; // Data to pre-fill the form with
}

// ==================== MAIN COMPONENT ====================

export default function OrderForm({
  orderId: existingOrderId,
  isEdit = false,
  preFillData,
}: OrderFormProps) {
  const router = useRouter()
  const dict = useOrderDictionary()
  const isSubmittingRef = useRef(false)

  // ==================== STATE MANAGEMENT ====================

  // Loading & Error States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Order Header States
  const [orderId, setOrderId] = useState('')
  const [kitchenId, setKitchenId] = useState('')
  const [kitchenName, setKitchenName] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')

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
  // Cache for supplier data to avoid redundant API calls
  const supplierCacheRef = useRef<Record<string, SupplierPrice[]>>({})
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
      setKitchenId(bestSuppliersData.kitchenId)
      // Find and set kitchen name
      const kitchen = availableKitchens.find(
        (k) => k.kitchenId === bestSuppliersData.kitchenId,
      )
      if (kitchen) {
        setKitchenName(kitchen.kitchenName)
      }
    }

    // Convert ingredients to supplementary foods (since we only have ingredient data)
    const supplementaryItems: SupplementaryFoodItem[] =
      bestSuppliersData.ingredients.map((ing: any, index: number) => ({
        id: `prefill-${index}`,
        ingredientId: ing.ingredientId,
        ingredientName: ing.ingredientName,
        unit: ing.unit,
        standardPerPortion: 0, // No standard per portion for supplementary items
        portions: 1, // Default to 1 portion
        quantity: ing.totalQuantity,
        note: '',
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
      setError(dict.common?.error || 'Failed to load kitchens')
    }
  }

  const loadDishes = async () => {
    try {
      const response = await dishApi.getAll('?per_page=100')
      const dishes = response.data || []
      setAvailableDishes(dishes)
      // Don't load recipe standards upfront - load them lazily when needed
    } catch (err) {
      console.error('Failed to load dishes:', err)
      setError(dict.common?.error || 'Failed to load dishes')
    }
  }

  // Lazy load recipe standards for a specific dish
  const loadRecipeStandardsForDish = async (dishId: string) => {
    // Check if already loaded
    if (dishRecipeStandards.has(dishId)) {
      return dishRecipeStandards.get(dishId) || []
    }

    try {
      const recipeResponse = await recipeStandardApi.getByDish(dishId)
      const recipes = recipeResponse.data || []

      // Update the map with the new data
      setDishRecipeStandards((prev) => {
        const newMap = new Map(prev)
        newMap.set(dishId, recipes)
        return newMap
      })

      return recipes
    } catch (err) {
      console.error(
        `Failed to load recipe standards for dish ${dishId}:`,
        err,
      )
      setDishRecipeStandards((prev) => {
        const newMap = new Map(prev)
        newMap.set(dishId, [])
        return newMap
      })
      return []
    }
  }

  const loadIngredients = async () => {
    try {
      const response = await ingredientApi.getAll('?per_page=100')
      setAvailableIngredients(response.data || [])
    } catch (err) {
      console.error('Failed to load ingredients:', err)
      setError(dict.common?.error || 'Failed to load ingredients')
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  // Safely add numbers avoiding floating point errors
  const safeAdd = (a: number, b: number): number => {
    return Math.round((a + b) * 10000) / 10000
  }

  // Safely multiply numbers avoiding floating point errors
  const safeMultiply = (a: number, b: number): number => {
    return Math.round(a * b * 10000) / 10000
  }

  // Round to 4 decimal places
  const safeRound = (num: number): number => {
    return Math.round(num * 10000) / 10000
  }

  // Format number to 4 decimal places, removing trailing zeros
  const formatNumber = (num: number): string => {
    const rounded = safeRound(num)
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

  const calculateTotalIngredients = (): TotalIngredient[] => {
    const totals: Record<string, TotalIngredient> = {}

    // From dishes
    orderDishes.forEach((dish) => {
      dish.ingredients.forEach((ing) => {
        if (totals[ing.ingredientId]) {
          totals[ing.ingredientId].totalQuantity = safeAdd(
            totals[ing.ingredientId].totalQuantity,
            ing.quantity
          )
        } else {
          totals[ing.ingredientId] = {
            ingredientId: ing.ingredientId,
            ingredientName: ing.ingredientName,
            totalQuantity: safeRound(ing.quantity),
            unit: ing.unit,
          }
        }
      })
    })

    // From supplementary foods
    supplementaryFoods.forEach((item) => {
      if (totals[item.ingredientId]) {
        totals[item.ingredientId].totalQuantity = safeAdd(
          totals[item.ingredientId].totalQuantity,
          item.quantity
        )
      } else {
        totals[item.ingredientId] = {
          ingredientId: item.ingredientId,
          ingredientName: item.ingredientName,
          totalQuantity: safeRound(item.quantity),
          unit: item.unit,
        }
      }
    })

    return Object.values(totals)
  }

  const totalIngredients = useMemo(
    () => calculateTotalIngredients(),
    [orderDishes, supplementaryFoods],
  )

  // ==================== SUPPLIER MANAGEMENT ====================

  const loadBestSuppliers = async (
    tempOrderId?: string,
    bestSuppliersData?: any,
  ) => {
    // For creating new orders, we need kitchenId and ingredients
    if (!kitchenId) {
      console.log('Kitchen ID is required to get best suppliers')
      return
    }

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
          setLoadingBestSuppliers(false)
          return
        }

        console.log('Loading best suppliers for ingredients:', totalIngredients)

        // Map to backend expected format: ingredientId, quantity, unit
        const ingredientsPayload = totalIngredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.totalQuantity,
          unit: ing.unit,
        }))

        const response = await orderApi.getBestSuppliersForNewOrder({
          kitchenId: kitchenId,
          ingredients: ingredientsPayload,
        })

        data = response as BestSupplierResponse
        console.log('Best suppliers API response:', data)
      }

      // Process best suppliers
      const newSelections: Record<string, number> = {}
      const newAvailableSuppliers: Record<string, SupplierPrice[]> = {}
      const newBestSuppliers: Record<string, BestSupplier | null> = {}

      console.log('Processing best suppliers for', data.ingredients.length, 'ingredients')

      // Use Promise.all to avoid await in loop
      await Promise.all(data.ingredients.map(async (ingData) => {
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

        // Load all available suppliers for this ingredient (with caching)
          try {
            let suppliers: SupplierPrice[] = []

            // Check cache first
            if (supplierCacheRef.current[ingId]) {
              suppliers = supplierCacheRef.current[ingId]
            } else {
              // Fetch from API if not in cache
              const suppliersResponse =
                await supplierPriceApi.getByIngredient(ingId)

              if (
                suppliersResponse &&
                typeof suppliersResponse === 'object' &&
                'data' in suppliersResponse
              ) {
                suppliers = suppliersResponse.data as SupplierPrice[]
              } else if (Array.isArray(suppliersResponse)) {
                suppliers = suppliersResponse
              }

              // Store in cache
              supplierCacheRef.current[ingId] = suppliers
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
      }))

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

  // Auto-load best suppliers when ingredients or kitchen change (with debounce)
  useEffect(() => {
    if (totalIngredients.length > 0 && kitchenId) {
      // Debounce to avoid excessive API calls during rapid changes
      const timeoutId = setTimeout(() => {
        loadBestSuppliers()
      }, 500) // Wait 500ms after last change

      return () => clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDishes, supplementaryFoods, kitchenId])

  const handleSupplierChange = (ingredientId: string, productIdStr: string) => {
    const productId = productIdStr ? parseInt(productIdStr, 10) : ''
    setSupplierSelections((prev) => ({
      ...prev,
      [ingredientId]: productId,
    }))
  }

  // ==================== DISH MANAGEMENT ====================

  const handleAddDishes = async () => {
    if (selectedDishes.length === 0 || portions <= 0) {
      alert(dict.order_form?.validation?.add_dish_or_food || 'Please select dishes and enter valid portions')
      return
    }

    // Load recipe standards for selected dishes if not already loaded
    const recipePromises = selectedDishes.map((dishId) =>
      loadRecipeStandardsForDish(dishId)
    )
    const recipeResults = await Promise.all(recipePromises)

    const newDishes: OrderDishItem[] = selectedDishes.map((dishId, index) => {
      const dish = availableDishes.find((d) => d.dishId === dishId)!
      const recipeStandards = recipeResults[index]

      const ingredients = recipeStandards.map((rs) => ({
        ingredientId: rs.ingredientId,
        ingredientName: rs.ingredientName || '',
        unit: rs.unit,
        standardPerPortion: safeRound(rs.standardPer1),
        quantity: safeMultiply(rs.standardPer1, portions),
      }))

      return {
        id: `${Date.now()}-${Math.random()}`,
        dishId: dish.dishId,
        dishName: dish.dishName,
        portions: portions,
        ingredients,
      }
    })

    setOrderDishes([...orderDishes, ...newDishes])
    closeDishModal()
  }

  const handleRemoveDish = (dishId: string) => {
    if (confirm(dict.order_form?.confirm_delete_dish || 'Are you sure you want to remove this dish?')) {
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
            portions: newPortions,
            ingredients: dish.ingredients.map((ing) => ({
              ...ing,
              quantity: safeMultiply(ing.standardPerPortion, newPortions),
            })),
          }
        }
        return dish
      }),
    )
  }

  const handleUpdateStandardPerPortion = (
    dishId: string,
    ingredientId: string,
    newStandardPerPortion: number,
  ) => {
    if (newStandardPerPortion < 0) return

    const roundedStandardPerPortion = safeRound(newStandardPerPortion)

    setOrderDishes(
      orderDishes.map((dish) => {
        if (dish.id === dishId) {
          return {
            ...dish,
            ingredients: dish.ingredients.map((ing) =>
              ing.ingredientId === ingredientId
                ? {
                    ...ing,
                    standardPerPortion: roundedStandardPerPortion,
                    quantity: safeMultiply(roundedStandardPerPortion, dish.portions),
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
              (ing) => ing.ingredientId !== ingredientId,
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
      alert(dict.order_form?.validation?.add_dish_or_food || 'Please select ingredients and enter valid quantity')
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
          (ing) => ing.ingredientId === ingId,
        )
        if (exists) return null

        return {
          ingredientId: ingredient.ingredientId,
          ingredientName: ingredient.ingredientName,
          unit: ingredient.unit,
          standardPerPortion: 0,
          quantity: safeRound(customAmount),
        }
      })
      .filter((ing) => ing !== null) as any[]

    if (newIngredients.length === 0) {
      alert(dict.order_form?.all_ingredients_exist || 'All ingredients already exist in the dish')
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
      alert(dict.order_form?.validation?.add_dish_or_food || 'Please select ingredients and enter valid quantity')
      return
    }

    const newSupplementaryFoods: SupplementaryFoodItem[] =
      selectedSupplementaryIngredients
        .map((ingId) => {
          const ingredient = availableIngredients.find(
            (ing) => ing.ingredientId === ingId,
          )
          if (!ingredient) return null

          const standardPerPortion = 0
          const quantity = safeMultiply(standardPerPortion, supplementaryAmount)

          return {
            id: `${Date.now()}-${Math.random()}`,
            ingredientId: ingredient.ingredientId,
            ingredientName: ingredient.ingredientName,
            unit: ingredient.unit,
            standardPerPortion,
            portions: supplementaryAmount,
            quantity,
            note: '',
          }
        })
        .filter((item) => item !== null) as SupplementaryFoodItem[]

    setSupplementaryFoods([...supplementaryFoods, ...newSupplementaryFoods])
    closeSupplementaryModal()
  }

  const handleUpdateSupplementaryStandardPerPortion = (id: string, newStandardPerPortion: number) => {
    if (newStandardPerPortion < 0) return

    const roundedStandardPerPortion = safeRound(newStandardPerPortion)

    setSupplementaryFoods(
      supplementaryFoods.map((item) => {
        if (item.id === id) {
          const newQuantity = safeMultiply(roundedStandardPerPortion, item.portions)
          return {
            ...item,
            standardPerPortion: roundedStandardPerPortion,
            quantity: newQuantity,
          }
        }
        return item
      }),
    )
  }

  const handleUpdateSupplementaryPortions = (id: string, newPortions: number) => {
    if (newPortions <= 0) return

    const roundedPortions = safeRound(newPortions)

    setSupplementaryFoods(
      supplementaryFoods.map((item) => {
        if (item.id === id) {
          const newQuantity = safeMultiply(item.standardPerPortion, roundedPortions)
          return {
            ...item,
            portions: roundedPortions,
            quantity: newQuantity,
          }
        }
        return item
      }),
    )
  }

  const handleUpdateSupplementaryNote = (id: string, noteText: string) => {
    setSupplementaryFoods(
      supplementaryFoods.map((item) =>
        item.id === id ? { ...item, note: noteText } : item,
      ),
    )
  }

  const handleRemoveSupplementaryFood = (id: string) => {
    if (confirm(dict.order_form?.confirm_delete_supplementary || 'Are you sure you want to remove this supplementary food?')) {
      setSupplementaryFoods(supplementaryFoods.filter((item) => item.id !== id))
    }
  }

  // ==================== MODAL HANDLERS ====================

  const handleSelectKitchen = (kitchen: Kitchen) => {
    setKitchenId(kitchen.kitchenId)
    setKitchenName(kitchen.kitchenName)
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
      setError(dict.order_form?.validation?.enter_order_id || 'Please enter order ID')
      isSubmittingRef.current = false
      return
    }

    if (!kitchenId.trim()) {
      setError(dict.order_form?.validation?.select_kitchen || 'Please select kitchen')
      isSubmittingRef.current = false
      return
    }

    if (orderDishes.length === 0 && supplementaryFoods.length === 0) {
      setError(dict.order_form?.validation?.add_dish_or_food || 'Please add at least one dish or supplementary food')
      isSubmittingRef.current = false
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const orderData: CreateOrderInput = {
        orderId,
        kitchenId: kitchenId,
        orderDate: orderDate,
        note: note,
        status: 'Pending',
        details: orderDishes.map((dish) => ({
          dishId: dish.dishId,
          portions: dish.portions,
          note: '',
          ingredients: dish.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            unit: ing.unit,
            standardPerPortion: ing.standardPerPortion,
          })),
        })),
        supplementaryFoods: supplementaryFoods.map((item) => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          standardPerPortion: item.standardPerPortion,
          portions: item.portions,
          note: item.note || '',
        })),
      }

      const createdOrder = await orderApi.create(orderData)
      setSuccess(dict.common?.success || 'Order created successfully!')

      // Redirect to order detail page
      setTimeout(() => {
        router.push(`/orders/${createdOrder.orderId}`)
      }, 1500)
    } catch (err: any) {
      const errorMessage = err.message || dict.common?.error || 'Error occurred while creating order'
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
          ngayLen={orderDate}
          tenBep={kitchenName}
          ghiChu={note}
          onOrderIdChange={setOrderId}
          onDateChange={setOrderDate}
          onKitchenSelect={() => setShowKitchenModal(true)}
          onNoteChange={setNote}
        />

        {/* Dishes Section */}
        <DishList
          dishes={orderDishes}
          onAddDish={() => setShowDishModal(true)}
          onPortionsChange={handleUpdatePortions}
          onStandardPerPortionChange={handleUpdateStandardPerPortion}
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
          onStandardPerPortionChange={handleUpdateSupplementaryStandardPerPortion}
          onPortionsChange={handleUpdateSupplementaryPortions}
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
                {dict.ingredient_summary?.actions?.processing || 'Processing...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                {dict.ingredient_summary?.actions?.save_order || 'Save Order'}
              </>
            )}
          </Button>

          {existingOrderId && (
            <Button
              type="button"
              variant="info"
              onClick={() => router.push(`/orders/${existingOrderId}/supplier-requests`)}
            >
              <FontAwesomeIcon icon={faFileAlt} className="me-2" />
              {dict.orders?.labels?.supplier_requests_title || 'Supplier Requests'}
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/orders')}
          >
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            {dict.order_form?.cancel || 'Cancel'}
          </Button>
        </div>
      </Form>

      {/* Modals */}
      <SingleSelectionModal
        show={showKitchenModal}
        onHide={closeKitchenModal}
        title={dict.orders_list?.table_headers?.kitchen || 'Select Kitchen'}
        items={filteredKitchens.map((k) => ({
          id: k.kitchenId,
          name: k.kitchenName,
          subtitle: k.address,
          badge: k.kitchenId,
          ...k,
        }))}
        searchValue={searchKitchen}
        onSearchChange={setSearchKitchen}
        selectedId={kitchenId}
        onSelect={(item) => handleSelectKitchen(item as Kitchen)}
        searchPlaceholder={dict.orders_list?.search_placeholder || 'Search kitchens...'}
        emptyMessage={dict.common?.no_data || 'No kitchen found'}
      />

      <MultiSelectionModal
        show={showDishModal}
        onHide={closeDishModal}
        title={`${dict.common?.add || 'Add'} ${dict.dish_list?.table_headers?.dish || 'Dish'}`}
        items={filteredDishes.map((d) => ({
          id: d.dishId,
          name: d.dishName,
          subtitle: `${dishRecipeStandards.get(d.dishId)?.length || 0} ${dict.dish_list?.table_headers?.ingredients || 'Ingredients'}`,
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
        searchPlaceholder={dict.orders_list?.search_placeholder || 'Search dishes...'}
        emptyMessage={dict.dish_list?.no_dishes || 'No dish found'}
        confirmLabel={`${dict.common?.add || 'Add'} ${selectedDishes.length} ${dict.dish_list?.table_headers?.dish || 'Dishes'}`}
        selectedCountLabel={`${dict.common?.selected || 'Selected'} ${selectedDishes.length} ${dict.dish_list?.table_headers?.dish || 'Dishes'}`}
        additionalFields={
          <FormGroup>
            <FormLabel>{dict.dish_list?.portions_for_all || 'Portions (apply to all selected dishes):'}</FormLabel>
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
        title={`${dict.common?.add || 'Add'} ${dict.dish_list?.table_headers?.ingredients || 'Ingredients'} ${dict.common?.to || 'to'} ${dict.dish_list?.table_headers?.dish || 'Dish'}`}
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
        searchPlaceholder={dict.orders_list?.search_placeholder || 'Search ingredients...'}
        emptyMessage={dict.ingredient_summary?.no_ingredients || 'No ingredient found'}
        confirmLabel={`${dict.common?.add || 'Add'} ${selectedIngredients.length} ${dict.dish_list?.table_headers?.ingredients || 'Ingredients'}`}
        selectedCountLabel={`${dict.common?.selected || 'Selected'} ${selectedIngredients.length} ${dict.dish_list?.table_headers?.ingredients || 'Ingredients'}`}
        additionalFields={
          <FormGroup>
            <FormLabel>{dict.order_form?.quantity || 'Quantity (apply to all selected ingredients):'}</FormLabel>
            <FormControl
              type="number"
              min="0"
              step="0.001"
              value={customAmount}
              onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
            />
          </FormGroup>
        }
      />

      <MultiSelectionModal
        show={showSupplementaryModal}
        onHide={closeSupplementaryModal}
        title={`${dict.common?.add || 'Add'} Supplementary ${dict.dish_list?.table_headers?.ingredients || 'Ingredients'}`}
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
        searchPlaceholder={dict.orders_list?.search_placeholder || 'Search ingredients...'}
        emptyMessage={dict.ingredient_summary?.no_ingredients || 'No ingredient found'}
        confirmLabel={`${dict.common?.add || 'Add'} ${selectedSupplementaryIngredients.length} ${dict.order_form?.add_supplementary_food || 'Supplementary'}`}
        selectedCountLabel={`${dict.common?.selected || 'Selected'} ${selectedSupplementaryIngredients.length} ${dict.dish_list?.table_headers?.ingredients || 'Ingredients'}`}
        confirmVariant="success"
        selectedHighlightClass="bg-success text-white"
        additionalFields={
          <FormGroup>
            <FormLabel>{dict.dish_list?.portions_for_all || 'Portions (apply to all selected ingredients):'}</FormLabel>
            <FormControl
              type="number"
              min="1"
              value={supplementaryAmount}
              onChange={(e) =>
                setSupplementaryAmount(parseInt(e.target.value) || 1)
              }
            />
            <small className="text-muted">
              {dict.order_form?.edit_after_add || 'You can edit standard and quantity after adding'}
            </small>
          </FormGroup>
        }
      />
    </>
  )
}
