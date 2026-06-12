import React from 'react';

export const FLIGHT_PREFIX = 'preset-flight-card';

export type PresetFlightCardWidgetProps = {
  airline?: string;
  airlineLogo?: string;
  flightNumber?: string;
  origin?: string;
  destination?: string;
  date?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  status?: string;
  statusColor?: string;
  price?: string;
  booked?: boolean;
  onBook?: () => void;
  className?: string;
};

const STATUS_COLORS: Record<string, string> = {
  'On Time': '#22c55e',
  Delayed: '#eab308',
  Cancelled: '#ef4444',
};

export function PresetFlightCardWidget({
  airline,
  airlineLogo,
  flightNumber,
  origin,
  destination,
  date,
  departureTime,
  arrivalTime,
  duration,
  status,
  statusColor,
  price,
  booked = false,
  onBook,
  className,
}: PresetFlightCardWidgetProps) {
  const dotColor = (typeof statusColor === 'string' ? statusColor : undefined) ?? STATUS_COLORS[String(status)] ?? '#22c55e';

  return (
    <div
      className={className}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '20px',
        background: '#ffffff',
        color: '#111827',
        minWidth: 260,
        maxWidth: 340,
        flex: '1 1 260px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header: airline + price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {airlineLogo && (
            <img src={String(airlineLogo)} alt={String(airline)} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain' }} />
          )}
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{String(airline)}</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>{String(price)}</span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280' }}>
        <span>{String(flightNumber)}</span>
        <span>{String(date)}</span>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: 0 }} />

      {/* Times */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{String(departureTime)}</span>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{String(duration)}</span>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{String(arrivalTime)}</span>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: 600 }}>
        <span>{String(origin)}</span>
        <span style={{ color: '#6b7280' }}>→</span>
        <span>{String(destination)}</span>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: 0 }} />

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{String(status)}</span>
        </div>

        {/* Book button */}
        <button
          type="button"
          disabled={booked}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '10px',
            border: booked ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
            background: booked ? 'color-mix(in srgb, #22c55e 10%, #ffffff)' : 'color-mix(in srgb, #f3f4f6 40%, #ffffff)',
            color: booked ? '#059669' : '#111827',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: booked ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onClick={() => {
            if (booked) return;
            onBook?.();
          }}
        >
          {booked && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {booked ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
}
