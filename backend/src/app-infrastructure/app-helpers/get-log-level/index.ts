import type { Level } from 'pino';

const statusLevelRules: Array<[number, number, Level]> = [
  [500, 599, 'error'],
  [400, 499, 'warn'],
  [300, 399, 'info'],
  [200, 299, 'info'],
  [100, 199, 'debug'],
];

export const getLogLevel = (statusCode: number): Level => {
  const rule = statusLevelRules.find(([min, max]) => statusCode >= min && statusCode <= max);
  return rule ? rule[2] : 'info'; // fallback
};
