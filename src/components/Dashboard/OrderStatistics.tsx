'use client'

import React from 'react'
import { Card, Col, Row, Spinner, Badge } from 'react-bootstrap'
import { useOrderCount } from '@/hooks/use-order-count'
import Link from 'next/link'
import useDictionary from '@/locales/dictionary-hook'

export default function OrderStatistics() {
  const dict = useDictionary()
  const { orderCount, loading, error } = useOrderCount({
    pollingInterval: 60000, // Refresh every 60 seconds
    enabled: true,
  })

  if (error) {
    return (
      <Card className="mb-4" style={{ minHeight: 'auto' }}>
        <Card.Header>
          <h5 className="mb-0">{dict.dashboard?.order_statistic || 'Order Statistics'}</h5>
        </Card.Header>
        <Card.Body>
          <div className="text-danger">{error}</div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">{dict.dashboard?.order_statistic || 'Order Statistics'}</h5>
      </Card.Header>
      <Card.Body>
        {loading && orderCount.totalCount === 0 ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">{dict.common?.loading || 'Loading...'}</span>
          </div>
        ) : (
          <Row>
            {/* Pending Orders - Highlighted */}
            <Col xs={12} sm={6} md={3} className="mb-3">
              <Link href="/orders?status=Pending" className="text-decoration-none">
                <div className="border rounded p-3 h-100 hover-shadow" style={{ cursor: 'pointer' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-muted">
                      {dict.orders?.status_names?.pending || 'Pending'}
                    </h6>
                    <Badge bg="warning" className="ms-2">
                      {dict.common?.new || 'New'}
                    </Badge>
                  </div>
                  <h2 className="mb-0 text-warning">{orderCount.pendingCount}</h2>
                  <small className="text-muted">
                    {dict.dashboard?.orders_need_attention || 'Orders need attention'}
                  </small>
                </div>
              </Link>
            </Col>

            {/* Total Orders */}
            <Col xs={12} sm={6} md={3} className="mb-3">
              <Link href="/orders" className="text-decoration-none">
                <div className="border rounded p-3 h-100 hover-shadow" style={{ cursor: 'pointer' }}>
                  <h6 className="mb-2 text-muted">
                    {dict.dashboard?.total_orders || 'Total Orders'}
                  </h6>
                  <h2 className="mb-0 text-primary">{orderCount.totalCount}</h2>
                  <small className="text-muted">
                    {dict.dashboard?.all_orders || 'All orders'}
                  </small>
                </div>
              </Link>
            </Col>

            {/* Other Status Counts */}
            {orderCount.statusCounts
              .filter((sc) => sc.status !== 'Pending')
              .slice(0, 2)
              .map((statusCount) => (
                <Col xs={12} sm={6} md={3} className="mb-3" key={statusCount.status}>
                  <Link
                    href={`/orders?status=${statusCount.status}`}
                    className="text-decoration-none"
                  >
                    <div className="border rounded p-3 h-100 hover-shadow" style={{ cursor: 'pointer' }}>
                      <h6 className="mb-2 text-muted">{statusCount.status}</h6>
                      <h2 className="mb-0">{statusCount.count}</h2>
                      <small className="text-muted">
                        {dict.dashboard?.orders || 'orders'}
                      </small>
                    </div>
                  </Link>
                </Col>
              ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  )
}
