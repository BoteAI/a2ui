import { useState, useCallback, useMemo } from 'react';
import { resolveBoundValue, dispatchDeclaredAction, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetFlightCardApi } from './api';
import type { PresetFlightCardWidgetProps } from './PresetFlightCardWidget';

type ApiProps = z.infer<typeof PresetFlightCardApi.schema>;

export function useFlightCardBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetFlightCardWidgetProps {
  const [booked, setBooked] = useState(false);

  const airline = useMemo(() => resolveBoundValue(host, apiProps.airline) || '', [host, apiProps.airline]);
  const airlineLogo = useMemo(() => resolveBoundValue(host, apiProps.airlineLogo) || '', [host, apiProps.airlineLogo]);
  const flightNumber = useMemo(() => resolveBoundValue(host, apiProps.flightNumber) || '', [host, apiProps.flightNumber]);
  const origin = useMemo(() => resolveBoundValue(host, apiProps.origin) || '', [host, apiProps.origin]);
  const destination = useMemo(() => resolveBoundValue(host, apiProps.destination) || '', [host, apiProps.destination]);
  const date = useMemo(() => resolveBoundValue(host, apiProps.date) || '', [host, apiProps.date]);
  const departureTime = useMemo(() => resolveBoundValue(host, apiProps.departureTime) || '', [host, apiProps.departureTime]);
  const arrivalTime = useMemo(() => resolveBoundValue(host, apiProps.arrivalTime) || '', [host, apiProps.arrivalTime]);
  const duration = useMemo(() => resolveBoundValue(host, apiProps.duration) || '', [host, apiProps.duration]);
  const status = useMemo(() => resolveBoundValue(host, apiProps.status) || '', [host, apiProps.status]);
  const statusColor = useMemo(
    () => (apiProps.statusColor != null ? resolveBoundValue(host, apiProps.statusColor) : '#059669'),
    [host, apiProps.statusColor],
  );
  const price = useMemo(() => resolveBoundValue(host, apiProps.price) || '', [host, apiProps.price]);

  const onBook = useCallback(() => {
    if (booked) return;
    dispatchDeclaredAction(host);
    setBooked(true);
  }, [host, booked]);

  return {
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
    booked,
    onBook,
  };
}
