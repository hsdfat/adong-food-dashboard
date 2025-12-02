'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faClock,
  faLocationDot,
  faTemperatureHalf
} from '@fortawesome/free-solid-svg-icons'
import useDictionary from '@/locales/dictionary-hook'
import Cookies from 'js-cookie'

interface WeatherData {
  temperature: number
  location: string
  loading: boolean
}

// Hanoi coordinates
const HANOI_LAT = 21.0285
const HANOI_LON = 105.8542

export default function HeaderWeatherTime() {
  const dict = useDictionary()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [currentDay, setCurrentDay] = useState<string>('')
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    location: 'Hà Nội',
    loading: true,
  })

  // Get locale
  const locale = Cookies.get('locale') || 'vi'

  // Update time and date every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      // Format time
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setCurrentTime(timeString)

      // Format date
      const dateString = now.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      setCurrentDate(dateString)

      // Get day of week
      const dayIndex = now.getDay()
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      setCurrentDay(days[dayIndex])
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [locale])

  // Fetch weather for Hanoi
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch weather data from Open-Meteo API for Hanoi (free, no API key required)
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${HANOI_LAT}&longitude=${HANOI_LON}&current=temperature_2m&timezone=Asia/Bangkok`
        )
        const weatherData = await weatherResponse.json()

        setWeather({
          temperature: Math.round(weatherData.current.temperature_2m),
          location: 'Hà Nội',
          loading: false,
        })
      } catch (error) {
        console.error('Weather fetch error:', error)
        setWeather({
          temperature: 0,
          location: 'Hà Nội',
          loading: false,
        })
      }
    }

    fetchWeather()
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="d-none d-lg-flex align-items-center gap-3 text-muted small">
      <div className="d-flex align-items-center gap-1">
        <FontAwesomeIcon icon={faCalendar} fixedWidth />
        <span>
          {dict.weather?.days?.[currentDay as keyof typeof dict.weather.days] || currentDay}, {currentDate}
        </span>
      </div>

      <div className="d-flex align-items-center gap-1">
        <FontAwesomeIcon icon={faClock} fixedWidth />
        <span>{currentTime}</span>
      </div>

      {!weather.loading && (
        <>
          <div className="d-flex align-items-center gap-1">
            <FontAwesomeIcon icon={faLocationDot} fixedWidth />
            <span>{weather.location}</span>
          </div>

          <div className="d-flex align-items-center gap-1">
            <FontAwesomeIcon icon={faTemperatureHalf} fixedWidth />
            <span>{weather.temperature}°C</span>
          </div>
        </>
      )}
    </div>
  )
}
