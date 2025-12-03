'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  Alert,
  Modal,
  Form,
  Badge,
  Spinner,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons'
import { messageTemplateApi } from '@/services'
import { MessageTemplate, CreateMessageTemplateInput, UpdateMessageTemplateInput } from '@/models/message-template'

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)

  const [formData, setFormData] = useState({
    templateName: '',
    templateType: 'zalo_supplier_request',
    content: '',
    isActive: true,
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await messageTemplateApi.getAll()
      setTemplates(response.data || [])
    } catch (err) {
      setError('Failed to load templates')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (template?: MessageTemplate) => {
    if (template) {
      setEditingTemplate(template)
      setFormData({
        templateName: template.templateName,
        templateType: template.templateType,
        content: template.content,
        isActive: template.isActive,
      })
    } else {
      setEditingTemplate(null)
      setFormData({
        templateName: '',
        templateType: 'zalo_supplier_request',
        content: '',
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTemplate(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTemplate) {
        const updateData: UpdateMessageTemplateInput = {
          templateName: formData.templateName,
          templateType: formData.templateType,
          content: formData.content,
          isActive: formData.isActive,
        }
        await messageTemplateApi.update(editingTemplate.templateId, updateData)
      } else {
        const createData: CreateMessageTemplateInput = {
          templateName: formData.templateName,
          templateType: formData.templateType,
          content: formData.content,
          isActive: formData.isActive,
        }
        await messageTemplateApi.create(createData)
      }
      handleCloseModal()
      loadTemplates()
    } catch (err) {
      setError(`Failed to ${editingTemplate ? 'update' : 'create'} template`)
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    try {
      await messageTemplateApi.delete(id)
      loadTemplates()
    } catch (err) {
      setError('Failed to delete template')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            <Spinner animation="border" className="me-2" />
            Loading templates...
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4>Message Templates</h4>
              <div className="text-muted">Manage customizable message templates</div>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {templates.length === 0 ? (
            <Alert variant="info" className="mb-0">
              No templates found. Create your first template.
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.templateId}>
                    <td>{template.templateId}</td>
                    <td><strong>{template.templateName}</strong></td>
                    <td><Badge bg="info">{template.templateType}</Badge></td>
                    <td>
                      {template.isActive ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td>{new Date(template.createdDate).toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleOpenModal(template)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(template.templateId)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTemplate ? 'Edit Template' : 'New Template'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Template Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.templateName}
                onChange={(e) =>
                  setFormData({ ...formData, templateName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Template Type</Form.Label>
              <Form.Select
                value={formData.templateType}
                onChange={(e) =>
                  setFormData({ ...formData, templateType: e.target.value })
                }
                required
              >
                <option value="zalo_supplier_request">Zalo Supplier Request</option>
                <option value="email_notification">Email Notification</option>
                <option value="sms">SMS</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={12}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                placeholder="Use {{placeholders}} like {{kitchenId}}, {{kitchenName}}, {{orderId}}, {{supplierName}}, {{ingredientName}}, {{quantity}}, {{unitPrice}}, {{totalCost}}, {{notes}}"
              />
              <Form.Text className="text-muted">
                Available placeholders: {'{{kitchenId}}'}, {'{{kitchenName}}'}, {'{{orderId}}'}, {'{{supplierName}}'}, {'{{ingredientName}}'}, {'{{quantity}}'}, {'{{unitPrice}}'}, {'{{totalCost}}'}, {'{{notes}}'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              {editingTemplate ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
