export const LogLevel = ["info", "error"] as const;

export type LogLevel = (typeof LogLevel)[number];

export type LogFunction = (message: string) => void;

export type Log = { message: string; level: LogLevel; timeStamp: Date };

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in LogLevel]: LogFunction;
};
