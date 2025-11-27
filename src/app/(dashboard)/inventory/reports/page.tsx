'use client'

import { useEffect, useState } from 'react'
import { inventoryReportsApi } from '@/services/inventory-api'
import {
  StockMovementReport,
  ExpiryAlert,
  TransactionSummary,
  TopConsumedIngredient,
} from '@/models'

export default function InventoryReportsPage() {
  const [kitchenId, setKitchenId] = useState('K001') // Default kitchen
  const [fromDate, setFromDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  )
  const [toDate, setToDate] = useState(
    new Date().toISOString().split('T')[0],
  )

  // Report states
  const [stockMovement, setStockMovement] = useState<StockMovementReport[]>([])
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([])
  const [transactionSummary, setTransactionSummary] = useState<
    TransactionSummary[]
  >([])
  const [topConsumed, setTopConsumed] = useState<TopConsumedIngredient[]>([])

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('movement')

  const fetchStockMovement = async () => {
    try {
      const response = await inventoryReportsApi.getStockMovement(
        kitchenId,
        fromDate,
        toDate,
      )
      setStockMovement(response.data)
    } catch (error) {
      console.error('Error fetching stock movement:', error)
    }
  }

  const fetchExpiryAlerts = async () => {
    try {
      const response = await inventoryReportsApi.getExpiryAlerts(kitchenId, 30)
      setExpiryAlerts(response.data)
    } catch (error) {
      console.error('Error fetching expiry alerts:', error)
    }
  }

  const fetchTransactionSummary = async () => {
    try {
      const response = await inventoryReportsApi.getTransactionSummary(
        kitchenId,
        fromDate,
        toDate,
      )
      setTransactionSummary(response.data)
    } catch (error) {
      console.error('Error fetching transaction summary:', error)
    }
  }

  const fetchTopConsumed = async () => {
    try {
      const response = await inventoryReportsApi.getTopConsumed(
        kitchenId,
        fromDate,
        toDate,
        10,
      )
      setTopConsumed(response.data)
    } catch (error) {
      console.error('Error fetching top consumed:', error)
    }
  }

  const fetchReports = async () => {
    if (!kitchenId) return

    setLoading(true)
    try {
      await Promise.all([
        fetchStockMovement(),
        fetchExpiryAlerts(),
        fetchTransactionSummary(),
        fetchTopConsumed(),
      ])
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header])).join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col">
          <h2>Inventory Reports</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="kitchenIdInput" className="form-label">
                Kitchen ID
              </label>
              <input
                id="kitchenIdInput"
                type="text"
                className="form-control"
                value={kitchenId}
                onChange={(e) => setKitchenId(e.target.value)}
                placeholder="e.g., K001"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="fromDateInput" className="form-label">
                From Date
              </label>
              <input
                id="fromDateInput"
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="toDateInput" className="form-label">
                To Date
              </label>
              <input
                id="toDateInput"
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={fetchReports}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="fa fa-search me-2" />
                    Generate Reports
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'movement' ? 'active' : ''}`}
            onClick={() => setActiveTab('movement')}
          >
            <i className="fa fa-exchange me-2" />
            Stock Movement
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'expiry' ? 'active' : ''}`}
            onClick={() => setActiveTab('expiry')}
          >
            <i className="fa fa-exclamation-triangle me-2" />
            Expiry Alerts
            {expiryAlerts.length > 0 && (
              <span className="badge bg-danger ms-2">
                {expiryAlerts.length}
              </span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <i className="fa fa-chart-pie me-2" />
            Transaction Summary
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'consumed' ? 'active' : ''}`}
            onClick={() => setActiveTab('consumed')}
          >
            <i className="fa fa-fire me-2" />
            Top Consumed
          </button>
        </li>
      </ul>

      {/* Stock Movement Report */}
      {activeTab === 'movement' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Stock Movement Report</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() =>
                exportToCSV(stockMovement, 'stock_movement_report')
              }
            >
              <i className="fa fa-download me-2" />
              Export CSV
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th className="text-end">Opening</th>
                    <th className="text-end">In</th>
                    <th className="text-end">Out</th>
                    <th className="text-end">Adjustment</th>
                    <th className="text-end">Closing</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {stockMovement.map((item) => (
                    <tr key={item.ingredientId}>
                      <td>{item.ingredientName}</td>
                      <td className="text-end">
                        {item.openingStock.toLocaleString()}
                      </td>
                      <td className="text-end text-success">
                        +{item.stockIn.toLocaleString()}
                      </td>
                      <td className="text-end text-danger">
                        -{item.stockOut.toLocaleString()}
                      </td>
                      <td
                        className={`text-end ${item.adjustment >= 0 ? 'text-success' : 'text-danger'}`}
                      >
                        {item.adjustment >= 0 ? '+' : ''}
                        {item.adjustment.toLocaleString()}
                      </td>
                      <td className="text-end fw-bold">
                        {item.closingStock.toLocaleString()}
                      </td>
                      <td>{item.unit}</td>
                    </tr>
                  ))}
                  {stockMovement.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expiry Alerts */}
      {activeTab === 'expiry' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Expiry Alerts (Next 30 Days)</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => exportToCSV(expiryAlerts, 'expiry_alerts')}
            >
              <i className="fa fa-download me-2" />
              Export CSV
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Import ID</th>
                    <th>Ingredient</th>
                    <th className="text-end">Quantity</th>
                    <th>Unit</th>
                    <th>Batch#</th>
                    <th>Expiry Date</th>
                    <th className="text-end">Days Left</th>
                    <th>Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {expiryAlerts.map((alert) => {
                    let urgencyClass = 'badge bg-warning'
                    let urgencyText = 'Notice'
                    if (alert.daysToExpiry <= 7) {
                      urgencyClass = 'badge bg-danger'
                      urgencyText = 'Critical'
                    } else if (alert.daysToExpiry <= 14) {
                      urgencyClass = 'badge bg-warning'
                      urgencyText = 'Warning'
                    } else {
                      urgencyClass = 'badge bg-info'
                    }

                    return (
                      <tr key={alert.importDetailId}>
                        <td>{alert.importId}</td>
                        <td>{alert.ingredientName}</td>
                        <td className="text-end">
                          {alert.quantity.toLocaleString()}
                        </td>
                        <td>{alert.unit}</td>
                        <td>{alert.batchNumber || '-'}</td>
                        <td>
                          {new Date(alert.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="text-end">{alert.daysToExpiry}</td>
                        <td>
                          <span className={urgencyClass}>{urgencyText}</span>
                        </td>
                      </tr>
                    )
                  })}
                  {expiryAlerts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        No expiring items in the next 30 days
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Summary */}
      {activeTab === 'summary' && (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Transaction Summary</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Transaction Type</th>
                        <th className="text-end">Total Quantity</th>
                        <th className="text-end">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionSummary.map((item) => (
                        <tr key={item.transactionType}>
                          <td>
                            <span className="badge bg-secondary">
                              {item.transactionType}
                            </span>
                          </td>
                          <td className="text-end">
                            {item.totalQuantity.toLocaleString()}
                          </td>
                          <td className="text-end">
                            {item.transactionCount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {transactionSummary.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            No transactions in the selected period
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Consumed */}
      {activeTab === 'consumed' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Top 10 Consumed Ingredients</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => exportToCSV(topConsumed, 'top_consumed')}
            >
              <i className="fa fa-download me-2" />
              Export CSV
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ingredient</th>
                    <th className="text-end">Total Consumed</th>
                    <th>Unit</th>
                    <th className="text-end">Export Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topConsumed.map((item, index) => (
                    <tr key={item.ingredientId}>
                      <td>{index + 1}</td>
                      <td>{item.ingredientName}</td>
                      <td className="text-end fw-bold">
                        {item.totalConsumed.toLocaleString()}
                      </td>
                      <td>{item.unit}</td>
                      <td className="text-end">{item.exportCount}</td>
                    </tr>
                  ))}
                  {topConsumed.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No consumption data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
