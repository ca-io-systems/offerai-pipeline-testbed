'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { Listing, MapBounds } from '@/lib/types'
import type L from 'leaflet'

type LeafletModule = typeof import('leaflet')

declare global {
  interface Window {
    L?: LeafletModule
  }
}

interface ListingsMapProps {
  listings: Listing[]
  highlightedId: string | null
  onMarkerHover: (id: string | null) => void
  onBoundsChange: (bounds: MapBounds) => void
  showSearchButton: boolean
  onSearchArea: () => void
}

export default function ListingsMap({
  listings,
  highlightedId,
  onMarkerHover,
  onBoundsChange,
  showSearchButton,
  onSearchArea,
}: ListingsMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  const createPriceIcon = useCallback((price: number, isHighlighted: boolean) => {
    if (typeof window === 'undefined' || !window.L) return null
    return window.L.divIcon({
      className: 'price-marker-container',
      html: `<div class="price-marker ${isHighlighted ? 'highlighted' : ''}">$${price}</div>`,
      iconSize: [0, 0],
      iconAnchor: [30, 15],
    })
  }, [])

  const createPopupContent = useCallback((listing: Listing) => {
    return `
      <div class="popup-card">
        <a href="/listings/${listing.id}" class="block">
          <img 
            src="${listing.imageUrl}" 
            alt="${listing.title}"
            class="w-full h-40 object-cover"
          />
          <div class="p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500">${listing.type}</span>
              <div class="flex items-center gap-1 text-xs">
                <span>★</span>
                <span>${listing.rating}</span>
              </div>
            </div>
            <h3 class="font-semibold text-sm mb-1">${listing.title}</h3>
            <p class="text-xs text-gray-500 mb-2">${listing.beds} bed${listing.beds !== 1 ? 's' : ''} · ${listing.baths} bath${listing.baths !== 1 ? 's' : ''}</p>
            <p class="font-semibold">$${listing.price}<span class="font-normal text-gray-500"> / night</span></p>
          </div>
        </a>
      </div>
    `
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const initMap = async () => {
      const L = await import('leaflet')
      await import('leaflet.markercluster')

      if (!containerRef.current) return

      const map = L.map(containerRef.current, {
        center: [40.73, -73.99],
        zoom: 12,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const markerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 15,
      })

      map.addLayer(markerClusterGroup)

      mapRef.current = map
      markerClusterRef.current = markerClusterGroup
      window.L = L

      map.on('moveend', () => {
        const bounds = map.getBounds()
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        })
      })

      setIsMapReady(true)
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [onBoundsChange])

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !markerClusterRef.current || !window.L) return

    markerClusterRef.current.clearLayers()
    markersRef.current.clear()

    listings.forEach((listing) => {
      const icon = createPriceIcon(listing.price, listing.id === highlightedId)
      if (!icon) return

      const marker = window.L!.marker([listing.lat, listing.lng], { icon })

      marker.bindPopup(createPopupContent(listing), {
        maxWidth: 280,
        minWidth: 280,
        className: 'listing-popup',
      })

      marker.on('mouseover', () => {
        onMarkerHover(listing.id)
      })

      marker.on('mouseout', () => {
        onMarkerHover(null)
      })

      markersRef.current.set(listing.id, marker)
      markerClusterRef.current!.addLayer(marker)
    })

    if (listings.length > 0) {
      const bounds = window.L!.latLngBounds(listings.map((l) => [l.lat, l.lng]))
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [listings, isMapReady, createPriceIcon, createPopupContent, onMarkerHover, highlightedId])

  useEffect(() => {
    if (!isMapReady || !window.L) return

    markersRef.current.forEach((marker, id) => {
      const listing = listings.find((l) => l.id === id)
      if (listing) {
        const icon = createPriceIcon(listing.price, id === highlightedId)
        if (icon) {
          marker.setIcon(icon)
        }
      }
    })
  }, [highlightedId, listings, createPriceIcon, isMapReady])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {showSearchButton && (
        <button onClick={onSearchArea} className="search-area-button">
          Search this area
        </button>
      )}
    </div>
  )
}
