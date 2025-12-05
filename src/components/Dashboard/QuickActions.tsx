'use client'

import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList, faFileImport } from '@fortawesome/free-solid-svg-icons'

export default function QuickActions() {
  return (
    <>
      <div className="row g-2">
        <div className="col-12 col-sm-6 col-lg-4">
          <Link href="/orders/create" className="text-decoration-none">
            <div className="quick-action-card quick-action-primary">
              <div className="quick-action-icon">
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <div className="quick-action-content">
                <h6 className="mb-0">Tạo đơn hàng</h6>
                <small className="text-muted">Tạo phiếu lên đơn món mới</small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <Link href="/inventory/imports" className="text-decoration-none">
            <div className="quick-action-card quick-action-success">
              <div className="quick-action-icon">
                <FontAwesomeIcon icon={faFileImport} />
              </div>
              <div className="quick-action-content">
                <h6 className="mb-0">Danh sách nhập kho</h6>
                <small className="text-muted">
                  Quản lý nhập kho nguyên liệu
                </small>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
          height: 100%;
        }

        .quick-action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .quick-action-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .quick-action-primary:hover {
          background: linear-gradient(135deg, #5568d3 0%, #6a4293 100%);
        }

        .quick-action-success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
        }

        .quick-action-success:hover {
          background: linear-gradient(135deg, #0f877c 0%, #32d66d 100%);
        }

        .quick-action-icon {
          font-size: 1.75rem;
          opacity: 0.9;
          flex-shrink: 0;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
        }

        .quick-action-content {
          flex: 1;
        }

        .quick-action-content h6 {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: white;
          font-size: 0.95rem;
        }

        .quick-action-content small {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.8rem;
        }

        @media (max-width: 576px) {
          .quick-action-card {
            padding: 0.75rem 0.875rem;
          }

          .quick-action-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
          }

          .quick-action-content h6 {
            font-size: 0.9rem;
          }

          .quick-action-content small {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  )
}
