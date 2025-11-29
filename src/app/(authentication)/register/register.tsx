'use client'

import { Alert, Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import InputGroupText from 'react-bootstrap/InputGroupText'
import { signIn } from 'next-auth/react'
import useDictionary from '@/locales/dictionary-hook'
import { authApi } from '@/services'

export default function Register() {
  const router = useRouter()
  const dict = useDictionary()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const passwordRepeat = formData.get('password_repeat') as string

    // Validate password match
    if (password !== passwordRepeat) {
      setError('Passwords do not match')
      setSubmitting(false)
      return
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setSubmitting(false)
      return
    }

    try {
      // Register the user
      const registerResponse = await authApi.register({
        username,
        email,
        password,
      })

      if (!registerResponse.success) {
        setError(registerResponse.message || 'Registration failed')
        return
      }

      // Auto-login after successful registration
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
        callbackUrl: '/',
      })

      if (!res) {
        setError('Registration successful, but login failed. Please try logging in.')
        return
      }

      const { ok, url, error: err } = res

      if (!ok) {
        if (err) {
          setError(`Registration successful, but login failed: ${err}`)
          return
        }

        setError('Registration successful, but login failed. Please try logging in.')
        return
      }

      if (url) {
        router.push(url)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Alert
        variant="danger"
        show={error !== ''}
        onClose={() => setError('')}
        dismissible
      >
        {error}
      </Alert>
      <Form onSubmit={register}>
        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faUser} fixedWidth />
          </InputGroupText>
          <FormControl
            name="username"
            required
            disabled={submitting}
            placeholder={dict.signup.form.username}
            aria-label="Username"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faEnvelope} fixedWidth />
          </InputGroupText>
          <FormControl
            type="email"
            name="email"
            required
            disabled={submitting}
            placeholder={dict.signup.form.email}
            aria-label="Email"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faLock} fixedWidth />
          </InputGroupText>
          <FormControl
            type="password"
            name="password"
            required
            disabled={submitting}
            placeholder={dict.signup.form.password}
            aria-label="Password"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faLock} fixedWidth />
          </InputGroupText>
          <FormControl
            type="password"
            name="password_repeat"
            required
            disabled={submitting}
            placeholder={dict.signup.form.confirm_password}
            aria-label="Confirm password"
          />
        </InputGroup>

        <Button
          type="submit"
          className="d-block w-100"
          disabled={submitting}
          variant="success"
        >
          {dict.signup.form.submit}
        </Button>
      </Form>
    </>
  )
}
