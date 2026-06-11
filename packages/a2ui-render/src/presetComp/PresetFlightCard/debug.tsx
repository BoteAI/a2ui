import React, { useState, useCallback } from 'react';
import { Card, Input, Divider, Typography, Space, Alert, Form } from 'antd';
import { PresetFlightCardWidget } from './PresetFlightCardWidget';

const { Text, Title } = Typography;

export default function PresetFlightCardDebug() {
  const [airline, setAirline] = useState('Delta Airlines');
  const [airlineLogo, setAirlineLogo] = useState('');
  const [flightNumber, setFlightNumber] = useState('DL 2402');
  const [origin, setOrigin] = useState('SFO');
  const [destination, setDestination] = useState('JFK');
  const [date, setDate] = useState('Mon, Jun 28');
  const [departureTime, setDepartureTime] = useState('8:30 AM');
  const [arrivalTime, setArrivalTime] = useState('2:45 PM');
  const [duration, setDuration] = useState('6h 15m');
  const [status, setStatus] = useState('On Time');
  const [statusColor, setStatusColor] = useState('#059669');
  const [price, setPrice] = useState('$384');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  const handleBook = () => {
    pushLog(`action: book → ${flightNumber} (${origin} → ${destination}) ${price}`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <Title level={3}>PresetFlightCard 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="airline">
              <Input value={airline} onChange={e => setAirline(e.target.value)} style={{ width: 150 }} />
            </Form.Item>
            <Form.Item label="airlineLogo">
              <Input value={airlineLogo} onChange={e => setAirlineLogo(e.target.value)} placeholder="https://..." style={{ width: 180 }} />
            </Form.Item>
            <Form.Item label="flightNumber">
              <Input value={flightNumber} onChange={e => setFlightNumber(e.target.value)} style={{ width: 100 }} />
            </Form.Item>
            <Form.Item label="origin">
              <Input value={origin} onChange={e => setOrigin(e.target.value)} style={{ width: 80 }} />
            </Form.Item>
            <Form.Item label="destination">
              <Input value={destination} onChange={e => setDestination(e.target.value)} style={{ width: 80 }} />
            </Form.Item>
            <Form.Item label="date">
              <Input value={date} onChange={e => setDate(e.target.value)} style={{ width: 130 }} />
            </Form.Item>
            <Form.Item label="departureTime">
              <Input value={departureTime} onChange={e => setDepartureTime(e.target.value)} style={{ width: 100 }} />
            </Form.Item>
            <Form.Item label="arrivalTime">
              <Input value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} style={{ width: 100 }} />
            </Form.Item>
            <Form.Item label="duration">
              <Input value={duration} onChange={e => setDuration(e.target.value)} style={{ width: 80 }} />
            </Form.Item>
            <Form.Item label="status">
              <Input value={status} onChange={e => setStatus(e.target.value)} style={{ width: 100 }} />
            </Form.Item>
            <Form.Item label="statusColor">
              <Input value={statusColor} onChange={e => setStatusColor(e.target.value)} style={{ width: 100 }} />
              <span
                style={{
                  display: 'inline-block',
                  width: 20,
                  height: 20,
                  background: statusColor,
                  borderRadius: 4,
                  marginLeft: 6,
                  verticalAlign: 'middle',
                  border: '1px solid #d1d5db',
                }}
              />
            </Form.Item>
            <Form.Item label="price">
              <Input value={price} onChange={e => setPrice(e.target.value)} style={{ width: 80 }} />
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <div style={{ maxWidth: 480 }}>
            <PresetFlightCardWidget
              airline={airline}
              airlineLogo={airlineLogo}
              flightNumber={flightNumber}
              origin={origin}
              destination={destination}
              date={date}
              departureTime={departureTime}
              arrivalTime={arrivalTime}
              duration={duration}
              status={status}
              statusColor={statusColor}
              price={price}
              onBook={handleBook}
            />
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <Alert
            message={JSON.stringify({
              airline,
              flightNumber,
              origin,
              destination,
              date,
              departureTime,
              arrivalTime,
              duration,
              status,
              price,
            })}
            type="info"
            showIcon
          />
        </Card>

        <Card title="事件日志" size="small" extra={<a onClick={() => setLogs([])}>清空</a>}>
          {logs.length === 0 ? (
            <Text type="secondary">暂无日志</Text>
          ) : (
            <div style={{ maxHeight: 240, overflow: 'auto', background: '#f6f8fa', padding: 8, borderRadius: 4 }}>
              {logs.map((log, i) => (
                <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: '20px' }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </Card>
      </Space>
    </div>
  );
}
