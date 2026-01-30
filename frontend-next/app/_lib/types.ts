export interface StockData {
  dateTime: string;
  price: number;
}

export type StockPoint = StockData;
export type ApiError = string | null;

export type Watchlist = {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
};

export type AlertStatus = 'active' | 'triggered' | 'resolved';

export type Alert = {
  id: string;
  symbol: string;
  threshold: number;
  direction: 'above' | 'below';
  schedule: 'realtime' | 'daily' | 'weekly';
  status: AlertStatus;
  createdAt: string;
};

export type Notification = {
  id: string;
  alertId: string;
  channel: 'email' | 'in-app';
  message: string;
  createdAt: string;
  read: boolean;
};

export type AlertJob = {
  id: string;
  alertId: string;
  runAt: string;
  status: 'queued' | 'completed';
};

export type Preferences = {
  theme: 'system' | 'light' | 'dark';
  currency: 'USD' | 'EUR' | 'GBP';
  notifications: {
    email: boolean;
    inApp: boolean;
  };
};
