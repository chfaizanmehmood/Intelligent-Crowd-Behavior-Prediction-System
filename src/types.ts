export type ActiveTab = 'dashboard' | 'upload' | 'results' | 'predictions' | 'logs' | 'settings';

export interface User {
  username: string;
  email: string;
  role: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: 'Success' | 'Processing' | 'Failed';
}

export interface AlertItem {
  timestamp: string;
  alertType: string;
  severity: 'INFO' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'Active' | 'Resolved' | 'Complete';
}

export interface CrowdMetrics {
  density: number;
  averageDensity: number;
  peakDensity: number;
  minDensity: number;
  state: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS' | 'HIGH';
  peopleCount: number;
  movementSpeed: number; // in m/s
  flowDirection: string;
  panicLevel: 'None detected' | 'Low' | 'Moderate' | 'High' | 'Critical';
  congestionPoints: number;
  anomalyEvents: number;
}

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2026-06-15 14:35:42',
    action: 'Prediction Generated',
    user: 'system_auto',
    details: 'Forecast updated (ID: P_12849)',
    status: 'Success'
  },
  {
    id: '2',
    timestamp: '2026-06-15 14:30:22',
    action: 'Video Analysis Complete',
    user: 'admin_user',
    details: 'VID_2026061514305 processed',
    status: 'Success'
  },
  {
    id: '3',
    timestamp: '2026-06-15 14:25:18',
    action: 'File Upload Started',
    user: 'admin_user',
    details: 'crowd_video_03.mp4 (245 MB)',
    status: 'Processing'
  },
  {
    id: '4',
    timestamp: '2026-06-15 14:18:45',
    action: 'Configuration Changed',
    user: 'admin_user',
    details: 'Alert threshold updated',
    status: 'Success'
  },
  {
    id: '5',
    timestamp: '2026-06-15 14:05:33',
    action: 'User Login',
    user: 'admin_user',
    details: 'Login from IP: 192.168.1.45',
    status: 'Success'
  },
  {
    id: '6',
    timestamp: '2026-06-15 13:52:19',
    action: 'Report Generated',
    user: 'operator_02',
    details: 'Daily summary report',
    status: 'Success'
  },
  {
    id: '7',
    timestamp: '2026-06-15 13:45:12',
    action: 'Alert Dismissed',
    user: 'operator_02',
    details: 'Alert ID: A_98432',
    status: 'Success'
  },
  {
    id: '8',
    timestamp: '2026-06-15 13:30:08',
    action: 'System Calibration',
    user: 'system_auto',
    details: 'Camera matrix updated',
    status: 'Success'
  },
  {
    id: '9',
    timestamp: '2026-06-15 13:15:55',
    action: 'Data Export',
    user: 'operator_01',
    details: 'Export format: CSV (2.4 MB)',
    status: 'Success'
  },
  {
    id: '10',
    timestamp: '2026-06-15 13:00:00',
    action: 'Backup Created',
    user: 'system_auto',
    details: 'Scheduled daily backup',
    status: 'Success'
  },
  {
    id: '11',
    timestamp: '2026-06-15 12:45:10',
    action: 'Threshold Triggered',
    user: 'system_auto',
    details: 'Density exceeded 65% in Zone B',
    status: 'Success'
  },
  {
    id: '12',
    timestamp: '2026-06-15 12:15:33',
    action: 'User Logout',
    user: 'operator_01',
    details: 'Logout after 4h shift',
    status: 'Success'
  },
  {
    id: '13',
    timestamp: '2026-06-15 11:42:19',
    action: 'Camera Connection Restored',
    user: 'system_auto',
    details: 'Feed Cam_04 live after brief latency spike',
    status: 'Success'
  },
  {
    id: '14',
    timestamp: '2026-06-15 10:30:00',
    action: 'Database Maintenance',
    user: 'system_auto',
    details: 'Archived records older than 30 days',
    status: 'Success'
  },
  {
    id: '15',
    timestamp: '2026-06-15 09:12:05',
    action: 'Manual Override',
    user: 'admin_user',
    details: 'Alert state forced to NORMAL for testing',
    status: 'Success'
  }
];

export const INITIAL_ALERT_HISTORY: AlertItem[] = [
  {
    timestamp: '2026-06-15 09:23:14',
    alertType: 'High Density Warning',
    severity: 'MODERATE',
    status: 'Resolved'
  },
  {
    timestamp: '2026-06-14 18:45:32',
    alertType: 'Unusual Flow Pattern',
    severity: 'LOW',
    status: 'Resolved'
  },
  {
    timestamp: '2026-06-14 16:12:08',
    alertType: 'System Calibration',
    severity: 'INFO',
    status: 'Complete'
  }
];
