import { z } from 'zod';
import { defineComponentApi, DynString } from '@boteai/a2ui-custom-kit';
import { ActionSchema } from '@boteai/a2ui-custom-kit';

export const PresetFlightCardApi = defineComponentApi({
  name: 'PresetFlightCard',
  shape: {
    /** 航空公司名称 */
    airline: DynString,
    /** 航空公司 Logo URL */
    airlineLogo: DynString,
    /** 航班号 */
    flightNumber: DynString,
    /** 出发地 */
    origin: DynString,
    /** 目的地 */
    destination: DynString,
    /** 日期 */
    date: DynString,
    /** 出发时间 */
    departureTime: DynString,
    /** 到达时间 */
    arrivalTime: DynString,
    /** 飞行时长 */
    duration: DynString,
    /** 状态文本 */
    status: DynString,
    /** 状态颜色 */
    statusColor: DynString.optional(),
    /** 价格 */
    price: DynString,
    /** 预订 action */
    action: ActionSchema.optional(),
  },
});
