'use server'

import { inventoryImportApi, inventoryExportApi, inventoryAdjustmentApi } from '@/services'

// Import actions
export async function approveImport(importId: string) {
  try {
    const result = await inventoryImportApi.approve(importId)
    return result
  } catch (error) {
    console.error('[Server Action] approveImport error:', error)
    throw error
  }
}

export async function createImport(data: any) {
  return inventoryImportApi.create(data)
}

export async function updateImport(importId: string, data: any) {
  return inventoryImportApi.update(importId, data)
}

export async function deleteImport(importId: string) {
  return inventoryImportApi.delete(importId)
}

export async function getImportById(importId: string) {
  try {
    const result = await inventoryImportApi.getById(importId)
    return result
  } catch (error) {
    console.error('[Server Action] getImportById error:', error)
    throw error
  }
}

// Export actions
export async function approveExport(exportId: string) {
  return inventoryExportApi.approve(exportId)
}

export async function createExport(data: any) {
  return inventoryExportApi.create(data)
}

export async function updateExport(exportId: string, data: any) {
  return inventoryExportApi.update(exportId, data)
}

export async function deleteExport(exportId: string) {
  return inventoryExportApi.delete(exportId)
}

export async function getExportById(exportId: string) {
  return inventoryExportApi.getById(exportId)
}

// Adjustment actions
export async function approveAdjustment(adjustmentId: string) {
  return inventoryAdjustmentApi.approve(adjustmentId)
}

export async function createAdjustment(data: any) {
  return inventoryAdjustmentApi.create(data)
}

export async function updateAdjustment(adjustmentId: string, data: any) {
  return inventoryAdjustmentApi.update(adjustmentId, data)
}

export async function deleteAdjustment(adjustmentId: string) {
  return inventoryAdjustmentApi.delete(adjustmentId)
}

export async function getAdjustmentById(adjustmentId: string) {
  return inventoryAdjustmentApi.getById(adjustmentId)
}
